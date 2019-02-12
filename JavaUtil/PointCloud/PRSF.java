package org.SpeedCloud.PointCloud;

/**
 * PointDataRecordStandardFields (PRSF)
 * @author dy
 *
 */
public class PRSF {
	/**
	 * 2.0版本 必须  可以与1.1 Type 1兼容
	 * 可选格式: I4, I8, R4, R8, R10
	 */
	private String LASF_X;
	/**
	 * 2.0版本 必须  可以与1.1 Type 1兼容
	 * 可选格式: I4, I8, R4, R8, R10
	 */
	private String LASF_Y;
	/**
	 * 2.0版本 必须  可以与1.1 Type 1兼容
	 * 可选格式: I4, I8, R4, R8, R10
	 */
	private String LASF_Z;
	/**
	 * 2.0版本 可选  可以与1.1 Type 1兼容
	 * 可选格式: UI1, UI2, UI4, R4, R8
	 */
	private String LASF_Intensity;
	/**
	 * 2.0版本 有条件的(与传感器有关)  可以与1.1 Type 1兼容
	 * 可选格式: BF1
	 */
	public static final String LASF_Return_Packet = "BF1";
	/**
	 * 2.0版本 必须  可以与1.1 Type 1兼容
	 * 可选格式: UI1
	 */
	public static final String LASF_Classification = "UI1";
	/**
	 * 2.0版本 可选  可以与1.1 Type 1兼容
	 * 可选格式: UI1
	 */
	public static final String LASF_Airborne_Scanner_Packet = "UI1";
	/**
	 * 2.0版本 可选  可以与1.1 Type 1兼容
	 * 可选格式: UI1
	 */
	public static final String LASF_User_Data = "UI1";
	/**
	 * 2.0版本 必须  可以与1.1 Type 1兼容
	 * 可选格式: UI2, UI4, UI8
	 */
	private String LASF_Point_Source_ID;
	/**
	 * 2.0版本 可选  可以与1.1 Type 1兼容
	 * 可选格式: R8
	 */
	public static final String LASF_GPS_Week_Time = "R8";
	/**
	 * 2.0版本 可选
	 * 可选格式: UI2
	 */
	public static final String LASF_GPS_Week = "UI2";
	/**
	 * 2.0版本 可选
	 * 可选格式: R4, R8
	 */
	private String LASF_Sigma_X;
	/**
	 * 2.0版本 可选
	 * 可选格式: R4, R8
	 */
	private String LASF_Sigma_Y;
	/**
	 * 2.0版本 可选
	 * 可选格式: R4, R8
	 */
	private String LASF_Sigma_Z;
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1, UI2, UI4, R4, R8
	 */
	private String LASF_Pan;
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1, UI2, UI4, R4, R8
	 */
	private String LASF_Red;
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1, UI2, UI4, R4, R8
	 */
	private String LASF_Green;
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1, UI2, UI4, R4, R8
	 */
	private String LASF_Blue;
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1, UI2, UI4, R4, R8
	 */
	private String LASF_NIR;
	/**
	 * 2.0版本 必须
	 * 可选格式: BF1
	 */
	public static final String LASF_Attributes = "BF1";
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1
	 */
	public static final String LASF_Class_Confidence = "UI1";
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1, UI2, UI4, UI8
	 */
	private String LASF_Group_ID;
	/**
	 * 2.0版本 可选
	 * 可选格式: R8
	 */
	public static final String LASF_POSIX_Time = "R8";
	/**
	 * 2.0版本 可选
	 * 可选格式: UI1, UI2, UI4, UI8
	 */
	private String LASF_PAD;
	/**
	 * 2.0版本 可选
	 * 可选格式: 用户自定义
	 */
	private String User_Defined_Fields;
	/**
	 * 2.0版本 可选
	 * 可选格式: 无
	 */
	private String LASF_END;
	public PRSF(String lASF_X, String lASF_Y, String lASF_Z, String lASF_Intensity, String lASF_Point_Source_ID,
			String lASF_Sigma_X, String lASF_Sigma_Y, String lASF_Sigma_Z, String lASF_Pan, String lASF_Red,
			String lASF_Green, String lASF_Blue, String lASF_NIR, String lASF_Group_ID, String lASF_PAD,
			String user_Defined_Fields, String lASF_END) {
		super();
		LASF_X = lASF_X;
		LASF_Y = lASF_Y;
		LASF_Z = lASF_Z;
		LASF_Intensity = lASF_Intensity;
		LASF_Point_Source_ID = lASF_Point_Source_ID;
		LASF_Sigma_X = lASF_Sigma_X;
		LASF_Sigma_Y = lASF_Sigma_Y;
		LASF_Sigma_Z = lASF_Sigma_Z;
		LASF_Pan = lASF_Pan;
		LASF_Red = lASF_Red;
		LASF_Green = lASF_Green;
		LASF_Blue = lASF_Blue;
		LASF_NIR = lASF_NIR;
		LASF_Group_ID = lASF_Group_ID;
		LASF_PAD = lASF_PAD;
		User_Defined_Fields = user_Defined_Fields;
		LASF_END = lASF_END;
	}
	public String getLASF_X() {
		return LASF_X;
	}
	public void setLASF_X(String lASF_X) {
		LASF_X = lASF_X;
	}
	public String getLASF_Y() {
		return LASF_Y;
	}
	public void setLASF_Y(String lASF_Y) {
		LASF_Y = lASF_Y;
	}
	public String getLASF_Z() {
		return LASF_Z;
	}
	public void setLASF_Z(String lASF_Z) {
		LASF_Z = lASF_Z;
	}
	public String getLASF_Intensity() {
		return LASF_Intensity;
	}
	public void setLASF_Intensity(String lASF_Intensity) {
		LASF_Intensity = lASF_Intensity;
	}
	public String getLASF_Return_Packet() {
		return LASF_Return_Packet;
	}
	public String getLASF_Classification() {
		return LASF_Classification;
	}
	public String getLASF_Airborne_Scanner_Packet() {
		return LASF_Airborne_Scanner_Packet;
	}
	public String getLASF_User_Data() {
		return LASF_User_Data;
	}
	public String getLASF_Point_Source_ID() {
		return LASF_Point_Source_ID;
	}
	public void setLASF_Point_Source_ID(String lASF_Point_Source_ID) {
		LASF_Point_Source_ID = lASF_Point_Source_ID;
	}
	public String getLASF_GPS_Week_Time() {
		return LASF_GPS_Week_Time;
	}
	public String getLASF_GPS_Week() {
		return LASF_GPS_Week;
	}
	public String getLASF_Sigma_X() {
		return LASF_Sigma_X;
	}
	public void setLASF_Sigma_X(String lASF_Sigma_X) {
		LASF_Sigma_X = lASF_Sigma_X;
	}
	public String getLASF_Sigma_Y() {
		return LASF_Sigma_Y;
	}
	public void setLASF_Sigma_Y(String lASF_Sigma_Y) {
		LASF_Sigma_Y = lASF_Sigma_Y;
	}
	public String getLASF_Sigma_Z() {
		return LASF_Sigma_Z;
	}
	public void setLASF_Sigma_Z(String lASF_Sigma_Z) {
		LASF_Sigma_Z = lASF_Sigma_Z;
	}
	public String getLASF_Pan() {
		return LASF_Pan;
	}
	public void setLASF_Pan(String lASF_Pan) {
		LASF_Pan = lASF_Pan;
	}
	public String getLASF_Red() {
		return LASF_Red;
	}
	public void setLASF_Red(String lASF_Red) {
		LASF_Red = lASF_Red;
	}
	public String getLASF_Green() {
		return LASF_Green;
	}
	public void setLASF_Green(String lASF_Green) {
		LASF_Green = lASF_Green;
	}
	public String getLASF_Blue() {
		return LASF_Blue;
	}
	public void setLASF_Blue(String lASF_Blue) {
		LASF_Blue = lASF_Blue;
	}
	public String getLASF_NIR() {
		return LASF_NIR;
	}
	public void setLASF_NIR(String lASF_NIR) {
		LASF_NIR = lASF_NIR;
	}
	public String getLASF_Attributes() {
		return LASF_Attributes;
	}
	public String getLASF_Class_Confidence() {
		return LASF_Class_Confidence;
	}
	public String getLASF_Group_ID() {
		return LASF_Group_ID;
	}
	public void setLASF_Group_ID(String lASF_Group_ID) {
		LASF_Group_ID = lASF_Group_ID;
	}
	public String getLASF_POSIX_Time() {
		return LASF_POSIX_Time;
	}
	public String getLASF_PAD() {
		return LASF_PAD;
	}
	public void setLASF_PAD(String lASF_PAD) {
		LASF_PAD = lASF_PAD;
	}
	public String getUser_Defined_Fields() {
		return User_Defined_Fields;
	}
	public void setUser_Defined_Fields(String user_Defined_Fields) {
		User_Defined_Fields = user_Defined_Fields;
	}
	public String getLASF_END() {
		return LASF_END;
	}
	public void setLASF_END(String lASF_END) {
		LASF_END = lASF_END;
	}
}
