#!/usr/bin/env python3
# -*- coding: utf8 -*-

import glob, json, joblib, re
import numpy as np
from PIL import Image
from multiprocessing import Process, Manager, Pool

print('Generating Y..')
trainY = json.loads(open('./data/raw/handwriting_data_info_clean.json', 'r').read())
trainY = [[row['image_id'], row['text']] for row in trainY['annotations'] if row['attributes']['type']=='글자(음절)']
trainY.append(['00192258', '핽'])
tgtSyllable = open('./data/targetSyllable.txt', 'r').read().replace('\n', '')
trainY = [row for row in trainY if re.match('['+tgtSyllable+']', row[1])]
trainY = sorted(trainY, key=lambda x: x[0])
tgtLst = [row[0] for row in trainY]
trainY = np.array([row[1] for row in trainY])
joblib.dump(trainY, './data/letterTrainY.bin')
print('Generating Y Done.')

print('Generating X..')
def selectTarget(imgPath):
	result = imgPath if re.search('/(\d+).png$', imgPath).group(1) in tgtLst else '0'
	return result
def getRgbFromImg(imgPath):
	result = {
		'fileNm' : re.search('/(\d+).png$', imgPath).group(1),
		'rgb' : 255-np.array(Image.open(imgPath).convert('L').resize((32, 32))).astype('float')
	}
	return result
imgLst = glob.glob('./data/raw/*.png')
pool = Pool(processes=8)
imgLst = pool.map( selectTarget, imgLst )
pool.close()
pool.join()
imgLst = [imgPath for imgPath in imgLst if imgPath!='0']
pool = Pool(processes=8)
trainX = pool.map( getRgbFromImg, imgLst )
pool.close()
pool.join()
trainX = sorted(trainX, key=lambda x: x['fileNm'])
trainX = np.array([row['rgb'] for row in trainX])
joblib.dump(trainX, './data/letterTrainX.bin')
print('Generating X Done.')