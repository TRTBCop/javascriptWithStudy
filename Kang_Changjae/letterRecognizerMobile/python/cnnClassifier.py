#!/usr/bin/env python3
# -*- coding: utf8 -*-

import pandas as pd
import glob
import pickle as pck
import keras.backend as K
from keras.datasets import mnist
from sklearn.preprocessing import MinMaxScaler
from keras.metrics import categorical_accuracy
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import *
from keras.optimizers import *
from keras.callbacks import EarlyStopping

(trainX, trainY), (validX, validY) = mnist.load_data()

trainX = trainX.astype('float32')
validX = validX.astype('float32')

scaler = MinMaxScaler()
trainX = scaler.fit_transform( trainX.reshape(60000, 28*28) )
validX = scaler.fit_transform( validX.reshape(10000, 28*28) )

trainX = trainX.reshape(60000, 28, 28, 1)
validX = validX.reshape(10000, 28, 28, 1)

trainY = to_categorical(trainY, 10)
validY = to_categorical(validY, 10)

model = Sequential()
model.add(Conv2D(filters=32, kernel_size=(5,5),padding='Same', activation='relu', input_shape=trainX.shape[1:]))
model.add(Conv2D(filters=32, kernel_size=(5,5),padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=64, kernel_size=(3,3),padding='Same', activation='relu'))
model.add(Conv2D(filters=64, kernel_size=(3,3),padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2), strides=(2,2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(256, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(10, activation='softmax'))
model.compile(
	optimizer=RMSprop(lr=0.001, rho=0.9, epsilon=1e-08, decay=0.0),
	loss = "categorical_crossentropy", metrics=["accuracy"]
)

model.fit(
	trainX, trainY,
	validation_data=(validX, validY),
	batch_size=int(trainX.shape[0]/10),
	epochs=10000,
	callbacks=[EarlyStopping(patience=10, monitor='loss')]
)

pck.dump( model, open('./model/digitCnnClassifier.bin', 'wb') )