# <center>记录人：DY</center>
--------------------------------

## 函数篇:

1.```viod EmitStreamVertex(int stream)``` 4.0以后

**名称**:EmitStreamVertex-将一个顶点发送至指定输出流

**参数**:_stream_ 指定将被发出的顶点流。

**介绍**:仅作用在Geometry Shader,此函数将输出变量的当前值发送给指定输出流(strean)上的原始输出。stream参数必须是一个数字常量。在此函数返回后,在所有输出流上的所有输出变量将变为undefined。

2.```void EmitVertex(void)``` 1.5以后

**名称**:EmitVertex-将一个顶点发送至第一个顶点输出流

**介绍**:仅作用在Geometry Shader,此函数将当前输出的变量的值发送给当前原始输出流中的第一个原始输出流。此函数相当于EmitStreamVertex(0)

3.```void EndPrimitive(void)``` 1.5以后

**名称**:EndPrimitive-完成在第一个顶点流上的原始输出

**介绍**:仅作用在Geometry Shader,此函数将在第一个顶点流上的输出流置为完成,然后开启一个新的顶点输出流。期间没有发送顶点信息。此函数相当于EndStreamPrimitive(0)

4.```void EndStreamPrimitive(int stream);``` 4.0以后

**名称**:EndStreamPrimitive-完成在指定顶点流上的原始输出

**参数**:_stream_ 指定将被完成的顶点流。

**介绍**:仅作用在Geometry Shader,此函数将在指定(stream)顶点流上的输出流置为完成,然后开启一个新的顶点输出流。期间没有发送顶点信息。

5.``` genType abs(genType x);1.10以后 genIType abs(genIType x);1.30以后 genDType abs(genDType x);4.10以后```

**名称**:abs-返回参数的绝对值

**参数**:_x_ 需要被返回绝对值的参数。

**介绍**:此函数返回(x)的绝对值

6.```genType acos(genType x);``` 1.10以后

**名称**:acos-返回参数的arccos。

**参数**:_x_ 需要被返回arccos的参数。

**介绍**:此函数返回(x)的arccos,返回的值域为[0,π],如果|x|>1返回undefined。

7.```genType acosh(genType x);``` 1.30以后

**名称**:acosh-返回参数的arccosh。

**参数**:_x_ 需要被返回arccosh的参数。

**介绍**:此函数返回(x)的arccosh,非负数的cosh反转，如果x<1返回undefined。

8.```bool all(bvec x);``` 1.10以后

**名称**:all-检测一个布尔矢量是否是全部为True。

**参数**:_x_ 需要被检测的布尔矢量。

**介绍**:此函数只有当x内所有的元素均为true才返回true,底层实现相当于:
``` openGL
bool all(bvec x){       // bvec can be bvec2, bvec3 or bvec4
        bool result = true;
        int i;
        for (i = 0; i < x.length(); ++i){
            result &= x[i];
        }
        return result;
    }
```

9.```bool any(bvec x)``` 1.10以后

**名称**:any-检测一个布尔矢量是否有True。

**参数**:_x_ 需要被检测的布尔矢量。

**介绍**:此函数只有当x内有元素均为true才返回true,底层实现相当于:
``` openGL
bool any(bvec x) {     // bvec can be bvec2, bvec3 or bvec4
        bool result = false;
        int i;
        for (i = 0; i < x.length(); ++i) {
            result |= x[i];
        }
        return result;
    }
```

10.```genType asin(genType x);``` 1.10以后

**名称**:asin-返回参数的arcsin。

**参数**:_x_ 需要被返回arcsin的参数。

**介绍**:此函数返回(x)的arcsin,返回的值域为[-π/2,π/2]，如果|x|>1返回undefined。

11.```genType asinh(	genType x);``` 1.30以后


**名称**:asinh-返回参数的arcsinh。

**参数**:_x_ 需要被返回arcsinh的参数。

**介绍**:此函数返回(x)的arcsinh。

12.```genType atan(	genType y,genType x);genType atan(	genType y-over-x); ```1.10以后

**名称**:atan-返回参数的arctan。

**参数**:_x_ 需要被返回arctan的参数的分母。
        _y_ 需要被返回arctan的参数的分子。
        _y-over-x_ 需要被返回arctan的小数

**介绍**:此函数返回y/x对应的角度。
        对应于第一个参数(y,x),y和x的符号用于确定返回角所属象限.返回的值域为[-π,π],如果x为0返回undefinded。
        对应第二个参数(y-over-x),返回的值域为[-π/2,π/2]。
        
13.```genType atanh(genType x);```1.10以后

**名称**:atanh-返回参数的arctanh。

**参数**:_x_ 需要被返回arctan的参数。

**介绍**:此函数返回参数的arctanh值,如果|x|>1返回undefined

14.```int atomicAdd(	inout int mem,int data);uint atomicAdd(	inout uint mem, uint data);```4.30以后

**名称**:atomicAdd-执行一次原子加。

**参数**:_mem_ 需要被执行运算的目标变量。
        _data_ 被加到mem的变量

**介绍**:此函数执行一次原子加后将改变的mem返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
        此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。
        
15.```int atomicAnd(inout int mem,int data);uint atomicAnd(inout uint mem,uint data);```4.30以后
 
**名称**:atomicAnd-执行一次原子逻辑AND运算。

**参数**:_mem_ 需要被执行运算的目标变量。
        _data_ 被逻辑AND运算到mem的变量

**介绍**:此函数执行一次原子逻辑AND后将改变的mem返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
        此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。
        
16.```int atomicCompSwap(	inout int mem,uint compare,uint data);uint atomicCompSwap(inout uint mem,uint compare,uint data);```4.30以后
 
**名称**:atomicCompSwap-执行一次原子对比替换运算。

**参数**:_mem_ 需要被执行运算的目标变量。
        _compare_  对比的标准变量
        _data_ 被对比和可能替换到mem的变量。

**介绍**:此函数执行一次原子对比替换后将改变的mem返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
        此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。
        * 原子对比替换是对比mem与compare,如果相等就替换data的对应位进入mem
17. ```uint atomicCounter(atomic_uint c);``` 4.20以后

**名称**:atomicCounter-返回当前值的原子计数。

**参数**:_c_ 需要被执行计数的目标计数器。

**介绍**:此函数返回一个当前值的原子计数。

18.```uint atomicCounterDecrement(atomic_uint c);``` 4.20以后

**名称**:atomicCounterDecrement-原子性的递减一个计数器然后返回上一个值。

**参数**:_c_ 需要被执行计数递减的目标计数器。

**介绍**:此函数原子性的递减一个计数器然后返回上一个值。

19.```uint atomicCounterIncrement(atomic_uint c);``` 4.20以后

**名称**:atomicCounterIncrement-原子性的递增一个计数器然后返回上一个值。

**参数**:_c_ 需要被执行计数递增的目标计数器。

**介绍**:此函数原子性的递增一个计数器然后返回上一个值。

20.```int atomicExchange(inout int mem,int data);uint atomicExchange(inout uint mem,uint data);```
       
**名称**:atomicExchange-执行一个对应变量的原子交换。

**参数**:_mem_ 需要被执行运算的目标变量。
         _data_ 被替换到mem的变量。

**介绍**:此函数执行一次原子替换后将改变的mem返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
         此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。
         
21.```int atomicMax(inout int mem,int data);uint atomicMax(inout uint mem,uint data);``` 4.30以后
       
**名称**:atomicMax-对于变量执行一次原子性最大值操作

**参数**:_mem_ 需要被执行运算的目标变量。
         _data_ 被替换到mem的变量。

**介绍**:此函数执行一次原子性最大值操作后将最大的值写入mem后返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
         此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。

22.```int atomicMin(inout int mem,int data);uint atomicMin(inout uint mem,uint data);``` 4.30以后
       
**名称**:atomicMin-对于变量执行一次原子性最小值操作
       
**参数**:_mem_ 需要被执行运算的目标变量。
        _data_ 被替换到mem的变量。
       
**介绍**:此函数执行一次原子性最小值操作后将最小的值写入mem后返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
         此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。
         
23.```int atomicOr(inout int mem,int data);uint atomicOr(inout uint mem,uint data);``` 4.30以后

**名称**:atomicOr-对于变量执行一次原子性逻辑OR操作
       
**参数**:_mem_ 需要被执行运算的目标变量。
        _data_ 被替换到mem的变量。
       
**介绍**:此函数执行一次原子性逻辑OR操作后将结果写入mem后返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
         此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。

24.```int atomicXor(inout int mem,int data);uint atomicXor(inout uint mem,uint data);``` 4.30以后

**名称**:atomicXor-对于变量执行一次原子性逻辑XOR操作
       
**参数**:_mem_ 需要被执行运算的目标变量。
        _data_ 被替换到mem的变量。
       
**介绍**:此函数执行一次原子性逻辑XOR操作后将结果写入mem后返回。被执行的内存在修改期间保证不会被别的命令修改(即进入同步区)。
         此函数只支持有限的变量集，着色器将在mem参数未与一个缓存或者着色器变量绑定时产生执行错误。

25.```void barrier(void);``` 4.00以后

**名称**:barrier-同步多个着色器调用
       
**介绍**:此函数只在Tessellation Control (渲染流程中从顶点着色器完成后转到片段着色器的中间管理过程)和Compute Shader(一项线程间数据通信)有效,此函数提供一个在多个着色器调用间的部分定义的执行顺序。
         对于一个静态定义的barrier实例来说，在Tessellation Control下所有针对单一输入路径的的调用必须先进入此实例再继续执行；在Compute Shader下所有在单独一个工作组下的调用必须先进入后继续执行。
         Barrier可以很好的保证前一个着色器调用修改后后一个着色器得到正确的内存值。
         barrier只可以放在Tessellation Control的main()函数中，但可以放在compute shader的任意地方。在任何控制流中和return之后使用barrier都是不对的。
    
26.```genIType bitCount(genIType value);genIType bitCount(genUType value);``` 4.0 以后

**名称**:bitCount-计算多少个比特在一个整数中
       
**参数**:value 需要计算比特数量的变量
              
**介绍**:此函数返回多少个比特在一个整数中。

27.```genIType bitfieldExtract(	genIType value,int offset,int bits); genUType bitfieldExtract(	genUType value,int offset,int bits);``` 4.0以后

**名称**:bitfieldExtract-从一个整数的中提取范围内的比特
       
**参数**:value 需要提取比特的变量
        offset 起始点
        bits 需要提取的比特数量
              
**介绍**:此函数从一个整数的中提取范围内的比特以最低有效位。被提取的比特的范围是[offset,offset+bits+1]。对于无符号的数字类型，最大有效位会变为0,对于由符号的类型，最大有效位会被置为offset+base-1
        如果bits参数是0，返回0。返回undefined如果offset或者bits是负数或者offset+bits大于value的存储长度。
        
28.4.0以后
```
genIType bitfieldInsert(	genIType base,
 	genIType insert,
 	int offset,
 	int bits);
 
genUType bitfieldInsert(	genUType base,
 	genUType insert,
 	int offset,
 	int bits);
```

**名称**:bitfieldInsert-添加一个范围内的比特入一个整数
       
**参数**:base 需要添加的原值
        insert 添加的变动值
        offset 起始点
        bits 需要添加的比特数量
              
**介绍**:此函数从base的offset位开始添加bits个最低有效位的insert的比特入base。返回值将拥有[offset,offset+bits+1]来自于insert的[0,bits-1]位的比特和其他在原本在base中的比特。
        如果bits参数是0，返回base。返回undefined如果offset或者bits是负数或者offset+bits大于存储此计算的比特数。

29.```genIType bitfieldReverse(	genIType value);genUType bitfieldReverse(	genUType value);``` 4.0 以后

**名称**:bitfieldReverse-反转一个整数当中的比特
       
**参数**:value 需要被反转的整数
              
**介绍**:此函数反转一个整数当中的比特。

30.```genType ceil(genType x);genDType ceil(genDType x);``` 1.10以后(genType) 4.0以后(genDType)

**名称**:ceil- 找到最近的一个大于或等于参数的整数。
       
**参数**:x 传入的参数
              
**介绍**:此函数找到最近的一个大于或等于参数的整数。

31.1.10以后(genType),1.30以后(genIType,genUType),4.0以后(genDType)
```
genType clamp(	genType x,
 	genType minVal,
 	genType maxVal);
genType clamp(	genType x,
 	float minVal,
 	float maxVal);
genDType clamp(	genDType x,
 	genDType minVal,
 	genDType maxVal);
genDType clamp(	genDType x,
 	double minVal,
 	double maxVal);
genIType clamp(	genIType x,
 	genIType minVal,
 	genIType maxVal);
genIType clamp(	genIType x,
 	int minVal,
 	int maxVal);
genUType clamp(	genUType x,
 	genUType minVal,
 	genUType maxVal);
genUType clamp(	genUType x,
 	uint minVal,
 	uint maxVal);
```

**名称**:clamp-约束一个值在另外两个值之间。
       
**参数**:x 需要约束的参数
         minVal 最小边界
         maxVal 最大边界
              
**介绍**:此函数约束一个值在另外两个值之间,相当于min(max(x,minVal),maxVal)。

32.```genType cos(genType angle);``` 1.10以后

**名称**:cos-返回传入弧度的cos。
       
**参数**:angle 弧度制的角
              
**介绍**:此函数返回传入弧度的cos。

33.```genType cosh(genType x);``` 1.30以后

**名称**:cosh-返回传入值的cosh。
       
**参数**:x 需要求cosh的值
              
**介绍**:此函数返回传入值的cosh,相当于计算(e^x+e^(-x))/2。

34.```vec3 cross(vec3 x,vec3 y);dvec3 cross(dvec3 x,dvec3 y);``` 1.10以后(vec3) 4.0以后(bvec3)

**名称**:cross-计算传入向量的叉积。
       
**参数**:x 第一个向量
         y 第二个向量
              
**介绍**:此函数计算传入向量的叉积,相当于计算x[1]*y[2]-y[1]*x[2]x[2]*y[0]-y[2]*x[0]x[0]*y[1]-y[0]*x[1]。

35.1.10以后(dFdx,dFdy) 4.50以后(dFdxCoarse, dFdxFine, dFdyCoarse, dFdyFine)
```
genType dFdx(genType p);
genType dFdy(genType p);
genType dFdxCoarse(genType p);
genType dFdyCoarse(genType p);
genType dFdxFine(genType p);
genType dFdyFine(genType p);
```

**名称**:dFdx, dFdy-返回参数对于x或者y部分微分。
       
**参数**:p 需要被部分微分的表达式
              
**介绍**:此函数仅可在片段着色器使用,dFdx 和dFdy 是针对屏幕坐标的xy轴。
        dFdxCoarse和dFdyCoarse 计算微分使用当前片段的附件片段，有可能使用当前片段(类似于计算一个面积内的微分)。
        dFdxFine和dFdyFine 计算微分使用本地区分,p和p的最近变量。
        
36.```genType degrees(genType radians);``` 1.10以后

**名称**:degrees-转换弧度到角度。
       
**参数**:radians 输入的弧度制
              
**介绍**:此函数可以转换弧度到角度,使用 (180-radians)/π

37.1.5以后(float) 4.0以后(double)
```
float determinant(mat2 m);
float determinant(mat3 m);
float determinant(mat4 m);
double determinant(dmat2 m);
double determinant(dmat3 m);
double determinant(dmat4 m);
```

**名称**:determinant-返回矩阵的行列式。
       
**参数**:m 输入的矩阵
              
**介绍**:此函数返回输入矩阵的行列式。

38.```float distance(genType p0,genType p1);double distance(genDType p0,genDType p1);``` 1.10以后(genType) 4.0以后(genDType)

**名称**:distance-计算两点之间的距离。
       
**参数**:p0 第一个点
        p1 第二个点
              
**介绍**:此函数计算两点之间的距离。

39.```float dot(genType x,genType y); double dot(genDType x,genDType y);``` 1.10以后(genType) 4.0以后(genDType)

**名称**:dot-计算两个向量的点乘。
       
**参数**:x 第一个向量
        y 第二个向量
              
**介绍**:此函数计算两个向量的点乘。

40.```bvec equal(vec x,vec y);bvec equal(ivec x,ivec y);bvec equal(uvec x,uvec y);``` 1.10以后

**名称**:equal-计算两个向量的是否相等。
       
**参数**:x 第一个向量
        y 第二个向量
              
**介绍**:此函数计算两个向量的是否相等。

41.```genType exp(	genType x);``` 1.10以后
   
**名称**:exp-计算传入参数的自然指数(e^x)。
          
**参数**:x 传入参数
                 
**介绍**:返回e^x。

42.```genType exp2(genType x);``` 1.10以后
      
**名称**:exp2-计算传入参数的2的x次幂(2^x)。
             
**参数**:x 传入参数
                    
**介绍**:返回2^x。

43. 1.10以后 genType, 4.0以后 genDType
```
genType faceforward(	genType N,
 	genType I,
 	genType Nref);
genDType faceforward(	genDType N,
 	genDType I,
 	genDType Nref);
``` 
      
**名称**:faceforward-返回一个和目标向量指向同一个方向的向量。
             
**参数**:N 指向原点的向量
         I 入射向量
         Nref 参照向量
                    
**介绍**:此函数将向量移至相对于其法向量远离表面的方向。如果(Nref,I)的点乘<0 此函数返回N,其他情况返回-N。

44. 4.0以后
```
genIType findLSB(	genIType value);
genIType findLSB(	genUType value);
``` 
      
**名称**:findLSB-找到最低有效位的index并置为1。
             
**参数**:value 需要被检查比特的值
                    
**介绍**:此函数将value的二进制形式的最低有效位置为1。如果value为0将返回-1。

45. 4.0以后
```
genIType findMSB(	genIType value);
genIType findMSB(	genUType value);
``` 
      
**名称**:findMSB-找到最高有效位的index并置为1。
             
**参数**:value 需要被检查比特的值
                    
**介绍**:此函数将value的二进制形式的最高有效位修改。对于正整数最高有效位置为1，对于负整数最高有效位置为0，对于vale为0或者-1 返回-1。

46. 3.3以后
```
genIType floatBitsToInt(	genType x);
genUType floatBitsToUint(	genType x);
``` 
      
**名称**:floatBitsToInt，floatBitsToUint-将一个浮点数的编码直接转换为integer格式。
             
**参数**:x 传入的需要保留浮点制编码方式的参数
                    
**介绍**:floatBitsToInt，floatBitsToUint以int或者uint的格式返回其浮点制编码的参项,浮点制的编码得以保护

47. 1.1 以后 genType  4.0以后 genDType
```
genType floor(	genType x);
genDType floor(	genDType x);
``` 
          
**名称**:floor-找到第一个小于或等于目标的整数。
                 
**参数**:x 目标
                        
**介绍**:找到第一个小于或等于目标的整数

48.4.0以后
```
genType fma(	genType a,
 	genType b,
 	genType c);
genDType fma(	genDType a,
 	genDType b,
 	genDType c);
``` 
          
**名称**:fma-融合乘加运算。
                 
**参数**:a 第一个乘数
         b 第二个乘数
         c 添加到前两个运算结果的数
                        
**介绍**:fam => a*b+c

49. 1.1 以后 genType 4.0 以后 genDType
```
genType fract(	genType x);
genDType fract(	genDType x);
``` 
          
**名称**:fract-计算目标的小数位。
                 
**参数**:x 目标
                        
**介绍**:返回x的小数位相当于 x-floor(x)

50. 4.0以后
```
genType frexp(	genType x,
 	out genIType exp);
genDType frexp(	genDType x,
 	out genIType exp);
``` 
          
**名称**:frexp-分解一个浮点数。

**参数**:x 需要被分解的浮点数
         out exp 放置返回的指数

**介绍**:frexp 相当于 x = significand*2^exponent significand取值[0.5,1.0);如果x =0 则significand和exponent都为0 如果x=NaN 则significand和exponent都为undefined