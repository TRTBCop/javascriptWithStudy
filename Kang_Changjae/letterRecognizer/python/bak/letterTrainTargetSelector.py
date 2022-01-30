#!/usr/bin/env python3
# -*- coding: utf8 -*-

import glob, json, joblib
import numpy as np
import pandas as pd

print('Selecting Letter Target..')

syllableLst = json.loads(open('./data/raw/handwriting_data_info_clean.json', 'r').read())
syllableLst = [
	[row['image_id'], row['text']]
	for row in syllableLst['annotations'] if row['attributes']['type']=='글자(음절)'
]
syllableLst.append(['00192258', '핽'])
syllableLst = pd.DataFrame(syllableLst, columns=['fileNm', 'syllable'], dtype='string')
tgtSyllable = open('./data/targetSyllable.txt', 'r').read().replace('\n', '')
syllableLst = syllableLst[syllableLst['syllable'].str.match('['+tgtSyllable+']')]

imgLst = pd.DataFrame(glob.glob('./data/raw/*.png'), columns=['imgPath'])
imgLst['fileNm'] = imgLst['imgPath'].str[11:-4]
train = pd.merge(syllableLst, imgLst, on=['fileNm'], how='inner')
train = train.sort_values(['fileNm'])

joblib.dump(train['syllable'].tolist(), './data/letterLableLst.bin')
joblib.dump(train['imgPath'].tolist(), './data/letterImgPathLst.bin')

print('Selecting Letter Target Done.')