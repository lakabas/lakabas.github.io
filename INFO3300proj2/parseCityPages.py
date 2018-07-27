import os
import csv
import re

def list_files(dir):
    r = []
    for root, dirs, files in os.walk(dir):
        for name in files:
            r.append(os.path.join(root, name))
    # print r
    return r



def getRows(datastring):
	keepGoing = True
	datarows = []
	trStart = 0
	trEnd = 0

	while(keepGoing):
		if "<tr>" not in datastring[trStart + 1:]:
			break
		trStart = datastring.index("<tr>", trStart + 1)
		trEnd = datastring.index("</tr>", trEnd + 1)

		rowContent = datastring[trStart + 4 : trEnd]

		datarows.append(rowContent)

	return datarows

def getRowValuesArr(headerRow):
	thInfosArr = []

	keepGoing = True
	thStart = 0
	thEndBracketStart = 0
	thEnd = 0
	while(keepGoing):
		if "<td" not in headerRow[thStart + 1:]:
			break
		thStart = headerRow.index("<td", thStart + 1)
		thEndBracketStart = headerRow.index(">", thStart + 1)
		thEnd = headerRow.index("</td>", thEnd + 1)

		content = headerRow[thEndBracketStart + 1 : thEnd]
		content = content.replace("&asymp;", "").replace("&amp;", "&")

		if "<a" in content:
			startTagEndIndex = content.index(">")
			endTagStartIndex = content.index("</a")
			content = content[startTagEndIndex + 1: endTagStartIndex]
		elif "building-status" in content:
			content = ""
		content = ' '.join(content.split())
		thInfosArr.append(content)

	return thInfosArr

def exportCSV(filesValuesArr, filename):
	with open("cityCSVs/" + filename + ".csv", "wb") as f:
	    writer = csv.writer(f)
	    writer.writerows(filesValuesArr)

def getCityNames(cityFileArr):
	slashIndex = cityFileArr[0].rfind("/")
	endIndicator = re.search(r"[\d]+\.txt", cityFileArr[0]).start()
	cityName = cityFileArr[0][slashIndex + 1:endIndicator]
	cityNamesArr = []
	cityNamesArr.append((cityName, 0))
	for x in range(len(cityFileArr)):
		if cityName not in cityFileArr[x]:
			slashIndex = cityFileArr[x].rfind("/")
			endIndicator = re.search(r"[\d]+\.txt", cityFileArr[x]).start()
			cityName = cityFileArr[x][slashIndex + 1:endIndicator]
			cityNamesArr.append((cityName, x))
	return cityNamesArr

def main():
	cityFileArr = list_files("infocities")
	del cityFileArr[0]

	cityNameArr = getCityNames(cityFileArr)

	fileValuesArr0 = []
	fileValuesArr1 = []
	fileValuesArr2 = []
	fileValuesArr3 = []
	fileValuesArr4 = []
	fileValuesArr5 = []
	fileValuesArr6 = []
	fileValuesArr7 = []
	fileValuesArr8 = []
	fileValuesArr9 = []

	for i in range(len(cityFileArr)):
		with open(cityFileArr[i], 'r') as myfile:
				data = myfile.read()
		rowsArr = getRows(data)
		rowsValuesArr = []
		for j in range(len(rowsArr)):
			rowsValuesArr.append(getRowValuesArr(rowsArr[j]))

		if i >= cityNameArr[0][1] and i < cityNameArr[1][1]:
			fileValuesArr0.append(rowsValuesArr)

		elif i >= cityNameArr[1][1] and i < cityNameArr[2][1]:
			fileValuesArr1.append(rowsValuesArr)
		
		elif i >= cityNameArr[2][1] and i < cityNameArr[3][1]:
			fileValuesArr2.append(rowsValuesArr)
		
		elif i >= cityNameArr[3][1] and i < cityNameArr[4][1]:
			fileValuesArr3.append(rowsValuesArr)
		
		elif i >= cityNameArr[4][1] and i < cityNameArr[5][1]:
			fileValuesArr4.append(rowsValuesArr)
		
		elif i >= cityNameArr[5][1] and i < cityNameArr[6][1]:
			fileValuesArr5.append(rowsValuesArr)
		
		elif i >= cityNameArr[6][1] and i < cityNameArr[7][1]:
			fileValuesArr6.append(rowsValuesArr)
		
		elif i >= cityNameArr[7][1] and i < cityNameArr[8][1]:
			fileValuesArr7.append(rowsValuesArr)
		
		elif i >= cityNameArr[8][1] and i < cityNameArr[9][1]:
			fileValuesArr8.append(rowsValuesArr)
		
		elif i >= cityNameArr[9][1]:
			fileValuesArr9.append(rowsValuesArr)

	lastOne = []
	canAdd = True
	for i in range(len(fileValuesArr0)):
		oneOff = []
		for j in range(len(fileValuesArr0[i])):
			if fileValuesArr0[i][j] != []:
				lastOne.append(fileValuesArr0[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr0 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr1)):
		oneOff = []
		for j in range(len(fileValuesArr1[i])):
			if fileValuesArr1[i][j] != []:
				lastOne.append(fileValuesArr1[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr1 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr2)):
		oneOff = []
		for j in range(len(fileValuesArr2[i])):
			if fileValuesArr2[i][j] != []:
				lastOne.append(fileValuesArr2[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr2 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr3)):
		oneOff = []
		for j in range(len(fileValuesArr3[i])):
			if fileValuesArr3[i][j] != []:
				lastOne.append(fileValuesArr3[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr3 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr4)):
		oneOff = []
		for j in range(len(fileValuesArr4[i])):
			if fileValuesArr4[i][j] != []:
				lastOne.append(fileValuesArr4[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr4 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr5)):
		oneOff = []
		for j in range(len(fileValuesArr5[i])):
			if fileValuesArr5[i][j] != []:
				lastOne.append(fileValuesArr5[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr5 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr6)):
		oneOff = []
		for j in range(len(fileValuesArr6[i])):
			if fileValuesArr6[i][j] != []:
				lastOne.append(fileValuesArr6[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr6 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr7)):
		oneOff = []
		for j in range(len(fileValuesArr7[i])):
			if fileValuesArr7[i][j] != []:
				lastOne.append(fileValuesArr7[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr7 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr8)):
		oneOff = []
		for j in range(len(fileValuesArr8[i])):
			if fileValuesArr8[i][j] != []:
				lastOne.append(fileValuesArr8[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr8 = lastOne

	lastOne = []
	for i in range(len(fileValuesArr9)):
		oneOff = []
		for j in range(len(fileValuesArr9[i])):
			if fileValuesArr9[i][j] != []:
				lastOne.append(fileValuesArr9[i][j])
	lastOne.insert(0, ["#", "Building", "Images", "Height", "Floors", "Building type", "Year", "Status"])
	fileValuesArr9 = lastOne

	exportCSV(fileValuesArr0, cityNameArr[0][0])
	exportCSV(fileValuesArr1, cityNameArr[1][0])
	exportCSV(fileValuesArr2, cityNameArr[2][0])
	exportCSV(fileValuesArr3, cityNameArr[3][0])
	exportCSV(fileValuesArr4, cityNameArr[4][0])
	exportCSV(fileValuesArr5, cityNameArr[5][0])
	exportCSV(fileValuesArr6, cityNameArr[6][0])
	exportCSV(fileValuesArr7, cityNameArr[7][0])
	exportCSV(fileValuesArr8, cityNameArr[8][0])
	exportCSV(fileValuesArr9, cityNameArr[9][0])
	


		# with open(filename, 'r') as myfile:
		# 	data = myfile.read()
		# 	dataArr.append(data)

		# for filename in cityFileArr:
		# with open(filename, 'r') as myfile:
		# 	data = myfile.read()
		# 	dataArr.append(data)

	# fileValuesArr = []
	# for i in range(len(dataArr)):
	# 	rowsArr = getRows(dataArr[i])
	# 	rowValuesArr = []
	# 	for j in range(len(rowsArr)):
	# 		# print j
	# 		rowValuesArr.append(getRowValuesArr(rowsArr[j]))
	# 	fileValuesArr.append(rowValuesArr)
	# allFilesValuesArr = []
	# # fileValuesArr = [item for items in fileValuesArr for item in items]
	# exportCSV(fileValuesArr, "eerr")

main()
			
