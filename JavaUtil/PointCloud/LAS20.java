package org.SpeedCloud.PointCloud;

import java.math.BigInteger;

public class LAS20 {
	/**
	 * UI1[32] 用于标识此文件的生产方
	 */
	public static final String GENERATINGSOFTWARE = "SpeedCloudPointCloudMaker";
	/**
	 * 头文件长度 单位为byte
	 */
	public static final int HEADER_lENGTH = 322;
	/**
	 * 文件的MAGIC NUMBER
	 */
	public static final String AIM_TYPE = "LASF";
	/**
	 * UI1[4] 文件标记符 只能是 LASF
	 */
	private String signature;
	/**
	 * UI4 文件的ID 0代表无ID
	 */
	private long ID;
	/**
	 * UI4 投影ID 用于界定此文件从属于某一个全局投影
	 */
	private long projectID_GUID1;
	/**
	 * UI2 投影ID 第二部分
	 */
	private int projectID_GUID2;
	/**
	 * UI2 投影ID 第三部分
	 */
	private int projectID_GUID3;
	/**
	 * UI1[8] 投影ID 第四部分
	 */
	private String projectID_GUID4;
	/**
	 * UI1 主要版本号
	 */
	private short VersionMajor;
	/**
	 * UI1 次级版本号
	 */
	private short VersionMinor;
	/**
	 * UI1[32] 文件系统标识符 可以做如下作用: 硬件系统标识符: "WIN94","IOS11"等 合并标识符: 用于标识此点云文件是其他多个文件的合并
	 * 修改标识符: 用于标识此点云文件是其他一个文件的修改版 提取标识符: 用于标识此点云文件是其他多个文件的提取版 转换标识符:
	 * 用于标识此点云文件是再次投影，拉伸，包裹等状态 其他
	 */
	private String SystemID;
	/**
	 * UI4 Julian Date 的日期数据
	 */
	private long CreationDate;
	/**
	 * UI4 Julian Date 的时间数据
	 */
	private long CreationTime;
	/**
	 * UI2 文件的header大小 322 不可改变
	 */
	private int HeaderSize;
	/**
	 * BF2 用于界定文件的数据来源 如果完全为0 则不知数据来源
	 */
	private int SourceID;
	/**
	 * UI2 用于标记point record Metadata的起始位置 应当和HeaderSize相同 为322
	 */
	private int OffsetToMetadtaBlock;
	/**
	 * UI2 用于标记point record Metadata的长度
	 */
	private int SizeOfMetaDataBlock;
	/**
	 * UI2 用于记录每一个点数据的长度 (同一个文件的所有点应当是同一长度)
	 */
	private int PointDataRecordLength;
	/**
	 * UI8 用于标记真实点云数据的起始位置
	 */
	private BigInteger OffsetToPointData;
	/**
	 * UI8 用于记录文件当中存储的点记录的总数
	 */
	private BigInteger NumberOfPointRecords;
	/**
	 * UI4 用于标记第一个变量的数据的起始位置
	 */
	private long OffsetToFirstVariableLength;
	/**
	 * UI4 用于记录变量的数据的个数
	 */
	private long NumberOfVariableLength;
	/**
	 * UI4[16] 此数组用于记录返回从NULL returns到 15 returns的总记录数 按照 [0] --- NULL [1] --- 1 [2]
	 * --- 2 . . . [15] --- 15 排列 如果系统不支持多重返回或者来源不支持批量返回则第二个入口 [1] 内为
	 * NumberOfPointRecords 其他的入口均为0
	 */
	private long[] NumberOfPointByReturn;
	/**
	 * UI1 记录此文件的兼容性 0 --- 点记录可以被LAS 1.1 0类兼容 1 --- 点记录可以被LAS 1.1 1类兼容 其他 留作备用
	 */
	private short PointRecordCompatibility;
	/**
	 * UI1 用于标记坐标系统 1 --- 地理坐标系或者其他用WKT(Well Know Text 知名)定义的在变量记录内定义投影坐标系 2 ---
	 * 笛卡尔坐标系 xyz 有标准笛卡尔意义 3 --- 正球面坐标系 x = r 点到球心的距离 y = θ XY面相对于X轴的方位角 取值 0 ≤ θ ≤
	 * 2 π， 正方向为逆时针 z = φ 相对于正Z轴的极角角度 取值 0 ≤ φ ≤ π 4 --- 反球面坐标系 x = r 点到球心的距离 y = θ
	 * XY面相对于X轴的方位角 取值 0 ≤ θ ≤ 2 π， 正方向为逆时针 z = φ 相对于正Z轴的极角角度 取值 0 ≤ φ ≤ π
	 */
	private char CoordinateSystemType;
	/**
	 * UI1 用于标记使用的单位 角均为弧度制 0 --- 单位定义在WKT文件内 1 --- 米 2 --- 国际英尺 3 --- 美标英尺 4 --- 角秒
	 * (只用于笛卡尔坐标体系)
	 */
	private char MetricUnits;
	/**
	 * UI1 用于标记垂直度量单位(只作用于笛卡尔坐标系) 0 --- 使用和 MetricUnits相同的单位 1 --- 米 2 --- 国际英尺 3
	 * --- 美标英尺
	 */
	private char VerticalMetricUnits;
	/**
	 * R8 X轴的原点值
	 */
	private double XOrigin;
	/**
	 * R8 Y轴的原点值
	 */
	private double YOrigin;
	/**
	 * R8 Z轴的原点值
	 */
	private double ZOrigin;
	/**
	 * BOOL 是否使用拉伸
	 */
	private boolean ApplyScaling;
	/**
	 * R8 X轴的拉伸参数
	 */
	private double XScaleFactor;
	/**
	 * R8 Y轴的拉伸参数
	 */
	private double YScaleFactor;
	/**
	 * R8 Z轴的拉伸参数
	 */
	private double ZScaleFactor;
	/**
	 * BOOL 是否启用偏移值
	 */
	private boolean ApplyOffsets;
	/**
	 * R8 X轴的偏移参数
	 */
	private double XOffset;
	/**
	 * R8 Y轴的偏移参数
	 */
	private double YOffset;
	/**
	 * R8 Z轴的偏移参数
	 */
	private double ZOffset;
	/**
	 * R8 X轴的最大值
	 */
	private double MaxX;
	/**
	 * R8 X轴的最小值
	 */
	private double MinX;
	/**
	 * R8 Y轴的最大值
	 */
	private double MaxY;
	/**
	 * R8 Y轴的最小值
	 */
	private double MinY;
	/**
	 * R8 Z轴的最大值
	 */
	private double MaxZ;
	/**
	 * R8 Z轴的最小值
	 */
	private double MinZ;
	/**
	 * 用于记录文件内的点数据的格式
	 */
	private PRSF PointDataRecordStandardFields;
	/**
	 * 用于记录文件内的点数据
	 */
	private Object[] PointData;
	public LAS20(String signature, long iD, long projectID_GUID1, int projectID_GUID2, int projectID_GUID3,
			String projectID_GUID4, short versionMajor, short versionMinor, String SystemID, long creationDate,
			long creationTime, int headerSize, int sourceID, int offsetToMetadtaBlock, int sizeOfMetaDataBlock,
			int pointDataRecordLength, BigInteger offsetToPointData, BigInteger numberOfPointRecords,
			long offsetToFirstVariableLength, long numberOfVariableLength, long[] numberOfPointByReturn,
			short pointRecordCompatibility, char coordinateSystemType, char metricUnits, char verticalMetricUnits,
			double xOrigin, double yOrigin, double zOrigin, boolean applyScaling, double xScaleFactor,
			double yScaleFactor, double zScaleFactor, boolean applyOffsets, double xOffset, double yOffset,
			double zOffset, double maxX, double minX, double maxY, double minY, double maxZ, double minZ,
			PRSF pointDataRecordStandardFields,Object[] pointData) {
		this.signature = signature;
		ID = iD;
		this.projectID_GUID1 = projectID_GUID1;
		this.projectID_GUID2 = projectID_GUID2;
		this.projectID_GUID3 = projectID_GUID3;
		this.projectID_GUID4 = projectID_GUID4;
		VersionMajor = versionMajor;
		VersionMinor = versionMinor;
		this.SystemID = SystemID;
		CreationDate = creationDate;
		CreationTime = creationTime;
		HeaderSize = headerSize;
		SourceID = sourceID;
		OffsetToMetadtaBlock = offsetToMetadtaBlock;
		SizeOfMetaDataBlock = sizeOfMetaDataBlock;
		PointDataRecordLength = pointDataRecordLength;
		OffsetToPointData = offsetToPointData;
		NumberOfPointRecords = numberOfPointRecords;
		OffsetToFirstVariableLength = offsetToFirstVariableLength;
		NumberOfVariableLength = numberOfVariableLength;
		NumberOfPointByReturn = numberOfPointByReturn;
		PointRecordCompatibility = pointRecordCompatibility;
		CoordinateSystemType = coordinateSystemType;
		MetricUnits = metricUnits;
		VerticalMetricUnits = verticalMetricUnits;
		XOrigin = xOrigin;
		YOrigin = yOrigin;
		ZOrigin = zOrigin;
		ApplyScaling = applyScaling;
		XScaleFactor = xScaleFactor;
		YScaleFactor = yScaleFactor;
		ZScaleFactor = zScaleFactor;
		ApplyOffsets = applyOffsets;
		XOffset = xOffset;
		YOffset = yOffset;
		ZOffset = zOffset;
		MaxX = maxX;
		MinX = minX;
		MaxY = maxY;
		MinY = minY;
		MaxZ = maxZ;
		MinZ = minZ;
		PointDataRecordStandardFields = pointDataRecordStandardFields;
		PointData = pointData;
	}

	public String getSignature() {
		return signature;
	}

	public void setSignature(String signature) {
		this.signature = signature;
	}

	public long getID() {
		return ID;
	}

	public void setID(long iD) {
		ID = iD;
	}

	public long getProjectID_GUID1() {
		return projectID_GUID1;
	}

	public void setProjectID_GUID1(long projectID_GUID1) {
		this.projectID_GUID1 = projectID_GUID1;
	}

	public int getProjectID_GUID2() {
		return projectID_GUID2;
	}

	public void setProjectID_GUID2(int projectID_GUID2) {
		this.projectID_GUID2 = projectID_GUID2;
	}

	public int getProjectID_GUID3() {
		return projectID_GUID3;
	}

	public void setProjectID_GUID3(int projectID_GUID3) {
		this.projectID_GUID3 = projectID_GUID3;
	}

	public String getProjectID_GUID4() {
		return projectID_GUID4;
	}

	public void setProjectID_GUID4(String projectID_GUID4) {
		this.projectID_GUID4 = projectID_GUID4;
	}

	public short getVersionMajor() {
		return VersionMajor;
	}

	public void setVersionMajor(short versionMajor) {
		VersionMajor = versionMajor;
	}

	public short getVersionMinor() {
		return VersionMinor;
	}
	public void setVersionMinor(short versionMinor) {
		VersionMinor = versionMinor;
	}

	public String getSystemID() {
		return SystemID;
	}

	public void setSystemID(String SystemID) {
		this.SystemID = SystemID;
	}

	public long getCreationDate() {
		return CreationDate;
	}

	public void setCreationDate(long creationDate) {
		CreationDate = creationDate;
	}

	public long getCreationTime() {
		return CreationTime;
	}

	public void setCreationTime(long creationTime) {
		CreationTime = creationTime;
	}

	public int getSourceID() {
		return SourceID;
	}

	public void setSourceID(int sourceID) {
		SourceID = sourceID;
	}

	public int getOffsetToMetadtaBlock() {
		return OffsetToMetadtaBlock;
	}

	public void setOffsetToMetadtaBlock(int offsetToMetadtaBlock) {
		OffsetToMetadtaBlock = offsetToMetadtaBlock;
	}

	public int getSizeOfMetaDataBlock() {
		return SizeOfMetaDataBlock;
	}

	public void setSizeOfMetaDataBlock(int sizeOfMetaDataBlock) {
		SizeOfMetaDataBlock = sizeOfMetaDataBlock;
	}

	public int getPointDataRecordLength() {
		return PointDataRecordLength;
	}

	public void setPointDataRecordLength(int pointDataRecordLength) {
		PointDataRecordLength = pointDataRecordLength;
	}

	public BigInteger getOffsetToPointData() {
		return OffsetToPointData;
	}

	public void setOffsetToPointData(BigInteger offsetToPointData) {
		OffsetToPointData = offsetToPointData;
	}

	public BigInteger getNumberOfPointRecords() {
		return NumberOfPointRecords;
	}

	public void setNumberOfPointRecords(BigInteger numberOfPointRecords) {
		NumberOfPointRecords = numberOfPointRecords;
	}

	public long getOffsetToFirstVariableLength() {
		return OffsetToFirstVariableLength;
	}

	public void setOffsetToFirstVariableLength(long offsetToFirstVariableLength) {
		OffsetToFirstVariableLength = offsetToFirstVariableLength;
	}

	public long getNumberOfVariableLength() {
		return NumberOfVariableLength;
	}

	public void setNumberOfVariableLength(long numberOfVariableLength) {
		NumberOfVariableLength = numberOfVariableLength;
	}

	public long[] getNumberOfPointByReturn() {
		return NumberOfPointByReturn;
	}

	public void setNumberOfPointByReturn(long[] numberOfPointByReturn) {
		NumberOfPointByReturn = numberOfPointByReturn;
	}

	public short getPointRecordCompatibility() {
		return PointRecordCompatibility;
	}

	public void setPointRecordCompatibility(short pointRecordCompatibility) {
		PointRecordCompatibility = pointRecordCompatibility;
	}

	public char getCoordinateSystemType() {
		return CoordinateSystemType;
	}

	public void setCoordinateSystemType(char coordinateSystemType) {
		CoordinateSystemType = coordinateSystemType;
	}

	public char getMetricUnits() {
		return MetricUnits;
	}

	public void setMetricUnits(char metricUnits) {
		MetricUnits = metricUnits;
	}

	public char getVerticalMetricUnits() {
		return VerticalMetricUnits;
	}

	public void setVerticalMetricUnits(char verticalMetricUnits) {
		VerticalMetricUnits = verticalMetricUnits;
	}

	public double getXOrigin() {
		return XOrigin;
	}

	public void setXOrigin(double xOrigin) {
		XOrigin = xOrigin;
	}

	public double getYOrigin() {
		return YOrigin;
	}

	public void setYOrigin(double yOrigin) {
		YOrigin = yOrigin;
	}

	public double getZOrigin() {
		return ZOrigin;
	}

	public void setZOrigin(double zOrigin) {
		ZOrigin = zOrigin;
	}

	public boolean isApplyScaling() {
		return ApplyScaling;
	}

	public void setApplyScaling(boolean applyScaling) {
		ApplyScaling = applyScaling;
	}

	public double getXScaleFactor() {
		return XScaleFactor;
	}

	public void setXScaleFactor(double xScaleFactor) {
		XScaleFactor = xScaleFactor;
	}

	public double getYScaleFactor() {
		return YScaleFactor;
	}

	public void setYScaleFactor(double yScaleFactor) {
		YScaleFactor = yScaleFactor;
	}
	public double getZScaleFactor() {
		return ZScaleFactor;
	}

	public void setZScaleFactor(double zScaleFactor) {
		ZScaleFactor = zScaleFactor;
	}

	public boolean isApplyOffsets() {
		return ApplyOffsets;
	}

	public void setApplyOffsets(boolean applyOffsets) {
		ApplyOffsets = applyOffsets;
	}

	public double getXOffset() {
		return XOffset;
	}

	public void setXOffset(double xOffset) {
		XOffset = xOffset;
	}

	public double getYOffset() {
		return YOffset;
	}

	public void setYOffset(double yOffset) {
		YOffset = yOffset;
	}

	public double getZOffset() {
		return ZOffset;
	}

	public void setZOffset(double zOffset) {
		ZOffset = zOffset;
	}

	public double getMaxX() {
		return MaxX;
	}

	public void setMaxX(double maxX) {
		MaxX = maxX;
	}

	public double getMinX() {
		return MinX;
	}

	public void setMinX(double minX) {
		MinX = minX;
	}

	public double getMaxY() {
		return MaxY;
	}

	public void setMaxY(double maxY) {
		MaxY = maxY;
	}

	public double getMinY() {
		return MinY;
	}

	public void setMinY(double minY) {
		MinY = minY;
	}

	public double getMaxZ() {
		return MaxZ;
	}

	public void setMaxZ(double maxZ) {
		MaxZ = maxZ;
	}

	public double getMinZ() {
		return MinZ;
	}

	public void setMinZ(double minZ) {
		MinZ = minZ;
	}
	public int getHeaderSize() {
		return HeaderSize;
	}
	public void setHeaderSize(int headerSize) {
		HeaderSize = headerSize;
	}
	public PRSF getPointDataRecordStandardFields() {
		return PointDataRecordStandardFields;
	}
	public void setPointDataRecordStandardFields(PRSF pointDataRecordStandardFields) {
		PointDataRecordStandardFields = pointDataRecordStandardFields;
	}

	public Object[] getPointData() {
		return PointData;
	}

	public void setPointData(Object[] pointData) {
		PointData = pointData;
	}
}