/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package datart.core.common;

import datart.core.base.exception.Exceptions;
import datart.core.base.exception.ServerException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeDriverService;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.util.FileCopyUtils;

import javax.script.ScriptException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;


@Slf4j
public class WebUtils {

    private static final Integer DEFAULT_TIMEOUT = 60;

    private static WebDriver createWebDriver() throws Exception {

        String driverPath = Application.getProperty("datart.screenshot.webdriver-path");

        if (StringUtils.isEmpty(driverPath)) {
            Exceptions.msg("message.not.found.webdriver");
        }

        String driverType = Application.getProperty("datart.screenshot.webdriver-type");

        switch (driverType) {
            case "CHROME":
                return createChromeWebDriver(driverPath);
            default:
                Exceptions.msg("message.unsupported.webdriver", driverType);
        }
        return null;
    }

    public static <T> T screenShot(String url, OutputType<T> outputType, int imageWidth) throws Exception {
        WebDriver webDriver = createWebDriver();
        T output = null;
        try {
            webDriver.get(url);

            WebDriverWait wait = new WebDriverWait(webDriver, getTimeout());

            ExpectedCondition<WebElement> ConditionOfSign = ExpectedConditions.presenceOfElementLocated(By.id("headlessBrowserRenderSign"));
            ExpectedCondition<WebElement> ConditionOfWidth = ExpectedConditions.presenceOfElementLocated(By.id("width"));
            ExpectedCondition<WebElement> ConditionOfHeight = ExpectedConditions.presenceOfElementLocated(By.id("height"));
            wait.until(ExpectedConditions.and(ConditionOfSign, ConditionOfWidth, ConditionOfHeight));

            Double contentWidth = Double.parseDouble(webDriver.findElement(By.id("width")).getAttribute("value"));

            Double contentHeight = Double.parseDouble(webDriver.findElement(By.id("height")).getAttribute("value"));

            if (imageWidth>0 && imageWidth != contentWidth) {
                // scale the window
                webDriver.manage().window().setSize(new Dimension(imageWidth, contentHeight.intValue()));
            }
            Thread.sleep(1500);
            // scale the window again
            contentWidth = Double.parseDouble(webDriver.findElement(By.id("width")).getAttribute("value"));
            contentWidth = contentWidth>0 ? contentWidth : 1920;
            contentHeight = Double.parseDouble(webDriver.findElement(By.id("height")).getAttribute("value"));
            contentHeight = contentHeight>0 ? contentHeight : 600;
            webDriver.manage().window().setSize(new Dimension(contentWidth.intValue(), contentHeight.intValue()));
            Thread.sleep(1000);

            TakesScreenshot screenshot = (TakesScreenshot) webDriver;
            output = screenshot.getScreenshotAs(outputType);
        } catch (Exception e) {
            Exceptions.e(e);
        } finally {
            webDriver.quit();
        }
        return output;
    }

    public static <T> T executeJavascript(String path,String type,String json) throws Exception {
        WebDriver driver = createWebDriver();
        T output = null;
        try {
            if (driver instanceof JavascriptExecutor) {
                output =(T)((JavascriptExecutor)driver).executeScript(load(path,type,json));
            } else {
                throw new IllegalStateException("This driver does not support JavaScript!");
            }
        } catch (Exception e) {
            Exceptions.e(e);
        } finally {
            driver.quit();
        }
        return output;
    }

    public static String load(String path,String type,String json) throws IOException, ScriptException {

        InputStream stream = null;

        if(path.startsWith("http") || path.startsWith("https")){
            stream = loadByNetWork(path);
        }else{
            stream = WebUtils.class.getClassLoader().getResourceAsStream(path);
        }

        if (stream == null) {
            Exceptions.notFound(path);
        }
        try (InputStreamReader reader = new InputStreamReader(stream)) {
            String script = IOUtils.toString(reader);
            script += String.format("return getQueryData('%s','%s')",type,json);
            return script;
        }
    }


    private static InputStream loadByNetWork(String path){
        try {
            return new URL(path).openStream();
        } catch (Exception e) {
            throw new ServerException(e.getMessage());
        }
    }

    public static File screenShot2File(String url, String path, int imageWidth) throws Exception {

        File temp = screenShot(url, OutputType.FILE, imageWidth);
        path = FileUtils.concatPath(path, temp.getName());
        File file = new File(path);

        FileUtils.delete(file);

        FileUtils.mkdirParentIfNotExist(path);

        FileCopyUtils.copy(temp, file);

        FileUtils.delete(temp);

        return file;
    }

    public static Integer getTimeout() {
        return Integer.parseInt(Application.getProperty("datart.screenshot.timeout-seconds", DEFAULT_TIMEOUT.toString()));
    }

    private static WebDriver createChromeWebDriver(String driverPath) throws Exception {

        ChromeOptions options = new ChromeOptions();
        options.addArguments("headless");
        options.addArguments("no-sandbox");
        options.addArguments("disable-gpu");
        options.addArguments("disable-features=NetworkService");
        options.addArguments("ignore-certificate-errors");
        options.addArguments("silent-launch");
        options.addArguments("disable-application-cache");
        options.addArguments("disable-web-security");
        options.addArguments("no-proxy-server");
        options.addArguments("disable-dev-shm-usage");
        options.addArguments("window-size=2048,1536");

        if (isRemoteDriver(driverPath)) {
            return new RemoteWebDriver(new URL(driverPath), options);
        }

        System.setProperty(ChromeDriverService.CHROME_DRIVER_EXE_PROPERTY, driverPath);

        return new ChromeDriver(options);
    }

    private static boolean isRemoteDriver(String driverPath) {
        return driverPath.startsWith("http");
    }

    public static boolean isDisplayed(WebElement element) {
        try {
            if(element.isDisplayed())
                return element.isDisplayed();
        }catch (NoSuchElementException ex) {
            return false;
        }
        return false;
    }
}
