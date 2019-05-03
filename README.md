## YbGoCloundFramework
====
## 基于Golang，Beego框架的SAAS云平台开发框架，代码重用高、体验好、性能卓越、数据隔离、便于多项目管理和维护。 
本框架开发过众多项目，本次开源基础权限框架部分及部分公共模块功能。 

## 框架特性
### 本框架可在一套源码中同时开发多个项目，做到多个项目模块复用的最大化，同时可大大减少后期的开发维护工作量
### 集成基础权限，权限通过XML配置权限，部署和维护比数据库中配置更方便
### SAAS基于系统->应用->租户->用户四级，可控制每个级别的功能权限和数据权限。 
### Rbac的权限控制方式，集成组织机构管理、角色管理、用户管理、权限资源管理，不同应用间数据完全隔离。
### 集成了灵活、强大的配置设置管理功能，同样分为系统->应用->租户->用户四级，每级具有权限的管理人员可自行管理的设置项。 
### 本框架开源部分开源了区域、流水号生成、基础代码管理等常用模块。
### 性能优越，集成Cache功能

安装方法    
----
1、go get https://gitee.com/yellbuy/YbGoCloundFramework    
2、创建mysql数据库，并将YbGoCloundFramework.sql导入    
3、修改config 配置数据库    
4、运行 go build    
5、运行 ./run.sh start|stop    
6、文件夹assets下分别为各个项目的权限资源和配置设置相关的XML文件    

前台访问：http://your_host:8081
后台访问：http://your_host:8081/login
用户名：admin 密码：123456

联系我
----
qq：19892257

许可证协议：
https://github.com/yellbuy/go-cloud-framework/edit/master/LICENSE.txt?raw=true

效果展示
----
基础框架：本次开源部分截图<br/>
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/1.1.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/1.2.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/1.3.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/1.4.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/1.5.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/1.6.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/1.7.png?raw=true)
<br/>
自定义表单，自定义流程<br/>
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/5.1.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/5.2.png?raw=true)
某电商Demo<br/>
1）小程序二维码
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.0.png?raw=true)
2）电商后端
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.1.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.2.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.3.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.4.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.5.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.6.png?raw=true)
3）电商前端
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.7.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.8.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.9.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.10.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.11.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.12.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.13.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.14.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/3.15.png?raw=true)
<br/>
CMS部分Demo<br/>
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/2.1.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/2.2.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/2.3.png?raw=true)
某金融项目<br/>
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/4.1.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/4.2.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/4.3.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/4.4.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/4.5.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/4.6.png?raw=true)
某快递物流项目<br/>
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/6.1.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/6.2.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/6.3.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/6.4.png?raw=true)
![image](https://github.com/yellbuy/go-cloud-framework/blob/master/demo/6.5.png?raw=true)
<br/>
其他项目略去
......
