#!/usr/bin/env python3
# -*- coding: utf8 -*-

import glob, joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.metrics import categorical_accuracy
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import *
from tensorflow.keras.optimizers import *
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.python.keras import backend as K

config = tf.compat.v1.ConfigProto()
config.gpu_options.per_process_gpu_memory_fraction=0.25
K.set_session(tf.compat.v1.Session(config=config))

trainX = joblib.load('./data/letterTrainX.bin')
trainX = MinMaxScaler().fit_transform( trainX.reshape(trainX.shape[0], 32*32) )
trainX = trainX.reshape(trainX.shape[0], 32, 32, 1)

trainY = joblib.load('./data/letterTrainY.bin')
strToIntMap = {string:integer for integer, string in enumerate(np.unique(trainY))}
intToStrMap = {integer:string for integer, string in enumerate(np.unique(trainY))}
trainY = [strToIntMap[string] for string in trainY]
trainY = to_categorical(trainY, len(np.unique(trainY)))

model = Sequential()
model.add(Conv2D(filters=16, kernel_size=(5,5),padding='Same', activation='relu', input_shape=trainX.shape[1:]))
model.add(Conv2D(filters=16, kernel_size=(5,5),padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=32, kernel_size=(4,4),padding='Same', activation='relu'))
model.add(Conv2D(filters=32, kernel_size=(4,4),padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=64, kernel_size=(3,3),padding='Same', activation='relu'))
model.add(Conv2D(filters=64, kernel_size=(3,3),padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2), strides=(2,2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(256, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(trainY.shape[1], activation='softmax'))
model.compile(optimizer=Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(
	trainX, trainY,
	batch_size=1000, epochs=1000, shuffle=True,
	callbacks=[EarlyStopping(patience=10, monitor='loss')]
)

joblib.dump(intToStrMap, './data/intToStrMap.bin')
joblib.dump(model, './model/letterCnnClassifier.bin')