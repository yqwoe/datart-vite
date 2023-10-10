package datart;
import org.apache.pdfbox.io.RandomAccessFile;
import org.apache.pdfbox.io.RandomAccessRead;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

/**

 *@authorCharlieChen

 *@DateTime2015-1-5上午9:55:38

 *@version1.0

 */

public class PdfUtil {

    /**

     *@paramargs

     */

    public static void main(String[] args) {

        String pdfPath = "/Users/yqwoe/Desktop/pdf/0104四版.pdf";

        String txtfilePath = "/Users/yqwoe/Desktop/pdf/res.txt";

        PdfUtil pdfutil = new PdfUtil();

        try {

            String content = pdfutil.getTextFromPdf(pdfPath);

            pdfutil.toTextFile(content, txtfilePath);

            System.out.println("Finished !");

        } catch (Exception e) {

            e.printStackTrace();

        }

    }

    /**

     *读取PDF文件的文字内容

     *@parampdfPath

     *@throwsException

     */

    public String getTextFromPdf(String pdfPath)

            throws Exception {

//是否排序

        boolean sort =

                false;

//开始提取页数

        int startPage = 1;

//结束提取页数

        int endPage = Integer.MAX_VALUE;

        String content = null;

        RandomAccessRead input = null;

        File pdfFile = new File(pdfPath);

        PDDocument document = null;

        try {

            input = new RandomAccessFile(pdfFile,"r");

//加载pdf 文档

            PDFParser parser = new PDFParser(input);

            parser.parse();

            document = parser.getPDDocument();

//获取内容信息

            PDFTextStripper pts = new PDFTextStripper();

            pts.setSortByPosition(sort);

            endPage = document.getNumberOfPages();

            System.out.println("Total Page: " + endPage);

            pts.setStartPage(startPage);

            pts.setEndPage(endPage);

            try {

                content = pts.getText(document);

            } catch (Exception e) {

                throw e;

            }

            System.out.println("Get PDF Content ...");

        } catch (Exception e) {

            throw e;

        } finally {

            if (null != input)

                input.close();

            if (null != document)

                document.close();

        }

        return content;

    }

    /**

     *把PDF文件内容写入到txt文件中

     *@parampdfContent

     *@paramfilePath

     */

    public void toTextFile(String pdfContent,String filePath) {

        try {

            File f = new File(filePath);

            if (!f.exists()) {

                f.createNewFile();

            }

            System.out.println("Write PDF Content to txt file ...");

            BufferedWriter output = new BufferedWriter(new FileWriter(f));

            output.write(pdfContent);

            output.close();

        } catch (Exception e) {

            e.printStackTrace();

        }

    }

}
