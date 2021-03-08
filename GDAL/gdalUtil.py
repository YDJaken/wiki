from osgeo import ogr, osr, gdal

def read_shp(file):
    targetSRS = osr.SpatialReference()
    targetSRS.ImportFromEPSG(4326)
    # open
    ds = ogr.Open(file, False)  # False - read only, True - read/write
    layer = ds.GetLayer(0)

    lydefn = layer.GetLayerDefn()
    fieldlist = []
    for i in range(lydefn.GetFieldCount()):
        fddefn = lydefn.GetFieldDefn(i)
        fddict = {'name': fddefn.GetName(), 'type': fddefn.GetType(),
                  'width': fddefn.GetWidth(), 'decimal': fddefn.GetPrecision()}
        fieldlist += [fddict]
    # records
    geomlist = []
    bounds = []
    reclist = []
    feature = layer.GetNextFeature()
    while feature is not None:
        geom = feature.GetGeometryRef()
        if geom.TransformTo(targetSRS) is not 0:
            print("Can't transform to EPSG:4326")
            return None
        geomlist += [geom]
        bounds += [geom.GetEnvelope()]
        rec = {}
        for fd in fieldlist:
            rec[fd['name']] = feature.GetField(fd['name'])
        reclist += [rec]
        feature = layer.GetNextFeature()
    # close
    ds.Destroy()
    return (geomlist, bounds, fieldlist, reclist)

def write_shp(file, data):
    gdal.SetConfigOption("GDAL_FILENAME_IS_UTF8", "YES")
    gdal.SetConfigOption("SHAPE_ENCODING", "UTF-8")
    spatialref, geomtype, geomlist, fieldlist, reclist = data
    # create
    driver = ogr.GetDriverByName("ESRI Shapefile")
    if os.access(file, os.F_OK):
        driver.DeleteDataSource(file)
    ds = driver.CreateDataSource(file)
    # spatialref = osr.SpatialReference( 'LOCAL_CS["arbitrary"]' )
    # spatialref = osr.SpatialReference().ImportFromProj4('+proj=tmerc ...')
    layer = ds.CreateLayer(file[:-4], srs=spatialref, geom_type=geomtype)
    # fields
    for fd in fieldlist:
        field = ogr.FieldDefn(fd['name'], fd['type'])
        if fd.has_key('width'):
            field.SetWidth(fd['width'])
        if fd.has_key('decimal'):
            field.SetPrecision(fd['decimal'])
        layer.CreateField(field)
    # records
    for i in range(len(reclist)):
        geom = ogr.CreateGeometryFromWkt(geomlist[i])
        feat = ogr.Feature(layer.GetLayerDefn())
        feat.SetGeometry(geom)
        for fd in fieldlist:
            feat.SetField(fd['name'], reclist[i][fd['name']])
        layer.CreateFeature(feat)
    # close
    ds.Destroy()
