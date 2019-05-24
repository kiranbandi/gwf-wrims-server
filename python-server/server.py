from vtools.datastore.dss.api import *
import pandas as pd
import traceback
from flask import Flask,request,abort, jsonify,json

dss_filename = "../model/workspace/dss/saskSV.dss"
catalog = dss_catalog(dss_filename)
ts = dss_retrieve_ts(dss_filename, selector='A=SASK B=I1 C=INFLOW')

#Flask instance
app = Flask('DSSFileParser')

@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "X-Requested-With,content-type, authorization"
    return response

@app.route('/get-catalog',methods=['GET'])
def read_catalog():
    try:
        return str(catalog)
    except:
        return bad_request('Error cataloging DFF file, try again later')

@app.route('/get-pathdata',methods=['POST'])
def read_pathdata():
    try:
        params = request.json
        if(('a' in params) and ('b' in params) and ('c' in params)):
            selector_path = 'A='+params['a']+" B="+params['b']+" C="+params['c']
            time_series = dss_retrieve_ts(dss_filename,str(selector_path))
            return str(time_series.data[:10])
        else:
            return bad_request('Invalid arguments')
    except:
            return bad_request('Error parsing DFF file, try again later')

def bad_request(message):
    response = jsonify({'message': message})
    response.status_code = 400
    return response

if __name__ == '__main__':
    app.run(port=8082)
