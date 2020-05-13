Java在复制文件时有
    
    1. Input/OutPutStream写的方式
    2. FileChannel写的方式
    3. 调用系统命令行
  
使用文件大小: 652,759,599 kb 压缩包 (622.52MB)

在Windows系统上的效率对比: JAVA 11
    
    Input/OutPutStream 移动文件用时:7853ms
    FileChannel 移动文件用时:607ms
    本机命令行移动文件用时:527ms
    
    Input/OutPutStream 移动文件用时:7496339800纳秒
    FileChannel 移动文件用时:591066700纳秒
    本机命令行移动文件用时:526333700纳秒
    
    Input/OutPutStream 移动文件用时:7610744600ms
    FileChannel 移动文件用时:575591600纳秒
    本机命令行移动文件用时:553122800纳秒
    
在Liunx系统上的运行效率对比: JAVA 8
    
    本次运行时间为创建新文件和覆盖
    Input/OutPutStream 移动文件用时:10212522375纳秒 10秒
    FileChannel 移动文件用时:6583416277纳秒 6.58秒
    本机命令行移动文件用时:968231246纳秒 0.9秒

    本次运行只有文件覆盖
    Input/OutPutStream 移动文件用时:7625766164纳秒 7.6秒
    FileChannel 移动文件用时:6153041345纳秒 6.15秒
    本机命令行移动文件用时:6306842952纳秒 6.3秒
    
    Input/OutPutStream 移动文件用时:7577845685纳秒 7.5秒
    FileChannel 移动文件用时:6359432680纳秒 6.35秒
    本机命令行移动文件用时:6351877050纳秒 6.35秒
    
在Liunx系统上的运行效率对比: JAVA 11
    
    本次运行时间为创建新文件和覆盖
    Input/OutPutStream 移动文件用时:11315730155纳秒 11.31秒
    FileChannel 移动文件用时:6674319391纳秒 6.67秒
    本机命令行移动文件用时:1384569130纳秒 1.38秒

    本次运行只有文件覆盖
    Input/OutPutStream 移动文件用时:7442752065纳秒  7.44秒
    FileChannel 移动文件用时:5804265732纳秒 5.80秒
    本机命令行移动文件用时:5937419134纳秒 5.93秒
    
    Input/OutPutStream 移动文件用时:6764783342纳秒 6.76秒
    FileChannel 移动文件用时:6075227859纳秒 6.07秒
    本机命令行移动文件用时:6213745089纳秒 6.21秒
    
经测试: FileChannel综合效率不差
