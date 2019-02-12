# ubuntu 装机需要的软件

## 常用软件

### zeal (开源离线文档,API阅读器)

```
sudo apt-get zeal
```

## 常用命令

### top 查看进程情况
```
top
```

### kill/pkill 停止进程
```
sudo kill pid  根据进程ID关闭
sudo pkil pname 根据进程名关闭
```

### ps
```
ps -L -C pname 根据进程名查看进程详情
ps -L -T tty1 根据终端ID查看此终端下的进程
```

### chmod
```
sudo chmod 777 -R ./../nmn
sudo chmod +x nnnn
sudo chmod -x nnn
```
### du
```
du -sh 检查此目录的大小
```

### fuser
```
fuser -k 8080/tcp 关闭占用8080端口的程序
```
### export 添加全局变量

```
export JAVA_HOME="/home/dy/Downloads/jdk1.8.0_191"
export JAVA_OPTS="-Xmx8g -Xms2g"
```

### netstat -ap 检查端口占用情况
```
netstat -ap | grep **
```

###  lsof 检查端口情况
```
lsof -i:**
```

### scp 跨主机复制
```
scp /home/dy/Desktop/graphhopperRouting.war root@192.168.1.195:/usr/local/apache-tomcat-8.5.34/webapps/
```