import sys
from PTTLibrary import PTT
import json
import numpy as np
import pandas as pd
from collections import Counter
import mysql.connector

#Database
mydb = mysql.connector.connect(
	host="localhost",
	user="root",
	passwd="phpmysql",
	database="databaseForBigData"
)
myCursor = mydb.cursor()

#Initial Global Param
PTTBot = PTT.Library(kickOtherLogin=False)
pushBoundary=0
Board='Testtttt'
StartIndex=0
EndIndex=0
showPushTime=False
GapPrint=0
GapBoundary=0

#V1.1 ADD
SearchID=False
TargetID='0'

#V1.2 ADD
IDList=[]
CalUnderPush=0

Month={'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}

#Read Setting
def readSettings():
	setting=[]
	st=pd.read_json('./settings.json')
	setting.append(st["ID"].values[0])
	setting.append(st["Password"].values[0])

	global pushBoundary,Board,StartIndex,EndIndex,showPushTime,GapPrint,GapBoundary
	
	pushBoundary=st["pushBoundary"].values[0]
	Board=st["Board"].values[0]
	StartIndex=st["StartIndex"].values[0]
	EndIndex=st["EndIndex"].values[0]
	showPushTime=st["showPushTime"].values[0]=='True'
	GapPrint=st["GapPrint"].values[0]
	GapBoundary=st["GapBoundary"].values[0]

	#V1.1
	global SearchID,TargetID
	SearchID=st["SearchID"].values[0]=='True'
	TargetID=st["TargetID"].values[0]

	#V1.2
	global CalUnderPush
	CalUnderPush=st["CalUnderPush"].values[0]
	return setting

def showPost(Post):
	PTTBot.Log('文章代碼: ' + Post.getID())
	PTTBot.Log('作者: ' + Post.getAuthor())
	PTTBot.Log('標題: ' + Post.getTitle())
	PTTBot.Log('時間: ' + Post.getDate())
	PTTBot.Log('價錢: ' + str(Post.getMoney()))
	PTTBot.Log('IP: ' + Post.getIP())
	PTTBot.Log('網址: ' + Post.getWebUrl())
	PTTBot.Log('文章列表日期: ' + Post.getListDate())

	PTTBot.Log('內文:\n' + Post.getContent())

	PushCount = 0
	BooCount = 0
	ArrowCount = 0

	for Push in Post.getPushList():
		PushType = Push.getType()

		if PushType == PTT.PushType.Push:
			PushCount += 1
		elif PushType == PTT.PushType.Boo:
			BooCount += 1
		elif PushType == PTT.PushType.Arrow:
			ArrowCount += 1
		
		Author = Push.getAuthor()
		Content = Push.getContent()
		# IP = Push.getIP()
		# PTTBot.Log('推文: ' + Author + ': ' + Content)
		
	PTTBot.Log('共有 ' + str(PushCount) + ' 推 ' + str(BooCount) + ' 噓 ' + str(ArrowCount) + ' 箭頭')
	
def main():
	setting = readSettings()

	# LOGIN
	ErrCode = PTTBot.login(str(setting[0]),str(setting[1]))
	if ErrCode != PTT.ErrorCode.Success:
		PTTBot.Log('Login Failed')
		sys.exit()

	# Get newest
	NewestIndex = EndIndex

	ErrCode, NewestIndex = PTTBot.getNewestIndex(Board=Board)

	if ErrCode != PTT.ErrorCode.Success:
		PTTBot.Log('取得 ' + Board + ' 板最新文章編號失敗')
	
	if NewestIndex == -1:
		PTTBot.Log('取得 ' + Board + ' 板最新文章編號失敗')
	# Get newest end

	# open file
	file = open("newfile.txt", "w", encoding = 'utf8')

	# 測試

	StartIndex = NewestIndex - 10

	for i in range(StartIndex, NewestIndex):
		ErrCode,Post=PTTBot.getPost(Board=Board,PostIndex=i)

		if ErrCode != PTT.ErrorCode.Success:
			continue

		test_str = str(i) + ": " + Post.getID() + " / " + Post.getAuthor() + " / " +  Post.getDate() + " / " + Post.getTitle()

		if test_str is None:
			continue

		print(test_str)
		file.write(test_str + "\n")

		sql = "INSERT INTO post (post_index, board, id, author, title, money, webUrl, date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
		val = (str(i), Post.getBoard(), Post.getID(), Post.getAuthor(), Post.getTitle(), Post.getMoney(), Post.getWebUrl(), Post.getDate())
		myCursor.execute(sql, val)

		myCursor.execute("CREATE TABLE post"+ str(i) + "(post_id VARCHAR(255), type TEXT, author TEXT, content TEXT, ip TEXT, time TEXT)")

		for x in Post.getPushList():
			sql = "INSERT INTO post"+ str(i) +" (post_id, type, author, content, ip, time) VALUES (%s, %s, %s, %s, %s, %s)"
			val = (Post.getID(), str(x.getType()), x.getAuthor(), x.getContent(), x.getIP(), x.getTime())
			myCursor.execute(sql, val)

	mydb.commit()

	# close file
	file.close()

main()
print(myCursor.rowcount, "record inserted.")

#chcp 65001