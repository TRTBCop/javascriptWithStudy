#!/usr/bin/env python3
# -*- coding: utf8 -*-

import glob, joblib
import pandas as pd
from PIL import Image
from sklearn.preprocessing import MinMaxScaler
from keras.utils import to_categorical, Sequence
from keras.metrics import categorical_accuracy
from keras.models import Sequential
from keras.layers import *
from keras.optimizers import *
from keras.initializers import *
from keras.callbacks import EarlyStopping
import tensorflow as tf
from tensorflow.python.keras import backend as K

config = tf.compat.v1.ConfigProto()
config.gpu_options.per_process_gpu_memory_fraction=0.2
K.set_session(tf.compat.v1.Session(config=config))

tgtImgPathLst = joblib.load('./data/letterImgPathLst.bin')
tgtLabelLst = joblib.load('./data/letterLableLst.bin')
strToIntMap = {string:integer for integer, string in enumerate(np.unique(tgtLabelLst))}
intToStrMap = {integer:string for integer, string in enumerate(np.unique(tgtLabelLst))}
tgtLabelLst = [strToIntMap[string] for string in tgtLabelLst]

class DataGenerator(Sequence):
	'Generates data for Keras'
	def __init__(self, listIDs, labels, batchSize, dim, nClasses, shuffle=True):
		'Initialization'
		self.dim = dim
		self.batchSize = batchSize
		self.labels = labels
		self.listIDs = listIDs
		self.nClasses = nClasses
		self.shuffle = shuffle
		self.on_epoch_end()

	def __len__(self):
		'Denotes the number of batches per epoch'
		return int(np.floor(len(self.listIDs) / self.batchSize))

	def __getitem__(self, index):
		'Generate one batch of data'
		# Generate indexes of the batch
		indexes = self.indexes[index*self.batchSize:(index+1)*self.batchSize]
		# Find list of IDs
		list_IDs_temp = [self.listIDs[k] for k in indexes]
		# Generate data
		x, y = self.__data_generation(list_IDs_temp)
		return x, y

	def on_epoch_end(self):
		'Updates indexes after each epoch'
		self.indexes = np.arange(len(self.listIDs))
		if self.shuffle == True:
			np.random.shuffle(self.indexes)

	def __data_generation(self, list_IDs_temp):
		'Generates data containing batch_size samples'
		# Initialization
		x = np.empty((self.batchSize, *self.dim))
		y = np.empty((self.batchSize), dtype=int)
		# Generate data
		for i, ID in enumerate(list_IDs_temp):
			# Store sample
			imgRgb = Image.open(ID).convert('L').resize((32, 32))
			imgRgb = 255-np.array(imgRgb).astype('float')
			imgRgb = MinMaxScaler().fit_transform(imgRgb)
			x[i,] = imgRgb.reshape(32, 32, 1)
			# Store class
			y[i] = self.labels[i]

		return x, to_categorical(y, num_classes=self.nClasses)
params = {
	'dim': (32,32,1),
	'batchSize': 10,
	'nClasses': len(np.unique(tgtLabelLst))
}
generator = DataGenerator(tgtImgPathLst, tgtLabelLst, **params)

model = Sequential()
model.add(
	Conv2D(
		filters=16, kernel_size=(5,5), padding='Same', activation='relu',
		kernel_initializer=he_normal(), bias_initializer=he_normal(),
		input_shape=(32, 32, 1)
	)
)
model.add(Conv2D(filters=16, kernel_size=(5,5), padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=32, kernel_size=(4,4), padding='Same', activation='relu'))
model.add(Conv2D(filters=32, kernel_size=(4,4), padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2)))
model.add(Dropout(0.25))
model.add(Conv2D(filters=64, kernel_size=(3,3), padding='Same', activation='relu'))
model.add(Conv2D(filters=64, kernel_size=(3,3), padding='Same', activation='relu'))
model.add(MaxPool2D(pool_size=(2,2), strides=(2,2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(512, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(len(np.unique(tgtLabelLst)), activation='softmax'))
model.compile(optimizer=Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])

history = model.fit_generator(
	generator=generator, callbacks=[EarlyStopping(patience=10, monitor='loss')],
	epochs=1000, use_multiprocessing=True, workers=1
)

joblib.dump(intToStrMap, './data/intToStrMap.bin')
joblib.dump(history, './model/letterCnnHistory.bin')
joblib.dump(model, './model/letterCnnClassifier.bin')