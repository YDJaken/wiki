# 本介绍文档基于 ``` "cesium": "1.60.0" ``` 版本

## layer.json内属性为:
  - attribution
  
      属性 解析后实际当作Credit使用
  - available
  
      用于记录地形数据在每一个层级的可用情况
  - bounds
  
      地形数据的经纬度边界: 遵循 ```[minLon,minLat,maxLon,maxLat]``` 写法
  - bvhlevels
  
      解析无意义 预留字段
  - description
  
      描述内容 解析无意义 预留字段
  - extensions
  
      告知解析器地形服务器支持哪些扩展类型 有以下4种扩展类型: ```["bvh", "watermask", "metadata", "octvertexnormals"]```
      
      - bvh: Bounding volume hierarchy 存储图形的包围信息和中心点
          
          解析无意义 预留字段
      
      - watermask:
      
          水纹理扩展
          
      - metadata
      
          元数据扩展
          
      - octvertexnormals/vertexnormals
      
          光效扩展 区别: 
          ```
          vertexnormals(弃置) 编码使用 Little Endian 低地址存放最低有效字节  
          octvertexnormals(推荐) 编码使用 Big Endian 低地址存放最高有效字节
          ```
  - format
  
      地形文件的编码方式 现支持两种 'quantized-mesh-1' 和 'heightmap-1.0'
  - maxzoom
    
      地形的最大层级
  - minzoom
  
      地形的最小层级  解析无意义 预留字段
  - name
  
      地形的命名 解析无意义 预留字段
  - projection
  
      地形文件使用的投影信息默认为"EPSG:4326" ```http://epsg.io/4326```
  - scheme
  
      地形文件服务器的遵从的标准，目前只有"tms" ```https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification```
  - tiles
    
      字符串数组,内为请求url生成的模板字符串 生成规则为:layer.json位置的目录+对应tiles字符串
  - version
  
      地形文件版本号可以与tiles做联动
  - parentUrl 
      
      必须和available同时存在,用于指明在多级地形情况下树形关系
