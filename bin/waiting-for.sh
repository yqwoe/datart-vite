#!/bin/bash

while :
    do
        # 访问eureka注册中心，获取http状态码
        CODE=`curl -I -m 10 -o /dev/null -s -w %{http_code}  http://data_cube_server:8080/api/v1/sys/info`
        # 判断状态码为200
        if [[ $CODE -eq 200 ]]; then
            # 输出绿色文字，并跳出循环
            echo -e "\033[42;34m server is ok \033[0m"
            break
        else
            # 暂停1秒
            sleep 1
        fi
    done
