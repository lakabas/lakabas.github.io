import json
import requests

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'}

teamIDs = []

for i in range(1610612737, 1610612766):
	teamIDs += [i]

playerIDs = [246, 292, 695, 1544, 120, 302, 1003, 363, 895, 673, 359, 87, 962, 1500, 72, 952, 65, 344, 963, 721, 1682, 969, 692, 440, 445, 418, 682, 431, 980, 1510, 1507, 1063, 198, 1035, 1538, 958, 753, 389, 54, 166, 26, 893, 197, 70, 146, 937, 82, 23, 714, 234, 1512, 982, 1065, 704, 76, 93, 1528, 762, 920, 35, 955, 1677, 1499, 924, 724, 1517, 1540, 1504, 111, 1051, 271, 179, 968, 960, 177, 1666, 84, 81, 679, 754, 221, 1502, 273, 986, 956, 280, 957, 1518, 787, 698, 1074, 53, 85, 17, 279, 970, 165, 788, 672, 1520, 441, 1134, 1037, 239, 1508, 71, 381, 1530, 1569, 915, 953, 965, 109, 224, 977, 89, 296, 468, 712, 406, 922, 916, 399, 173, 785, 371, 105, 896, 702, 469, 1110, 190, 297, 55, 136, 386, 210, 1036, 288, 994, 688, 894, 1532, 457, 951, 911, 238, 324, 950, 52, 223, 67, 708, 345, 674, 1545, 417, 685, 914, 938, 208, 967, 446, 383, 423, 428, 954, 710, 1496, 262, 420, 164, 913, 317, 194, 201, 275, 369, 121, 891, 187, 168, 433, 128, 1563, 899, 1535, 157, 1511, 786, 7, 98, 400, 448, 270, 696, 147, 365, 349, 904, 697, 397, 905, 213, 770, 998, 22, 104, 1501, 947, 707, 243, 693, 1515, 727, 1529, 689, 934, 281, 95, 364, 192, 134, 959, 73, 1527, 77597, 45, 361, 467, 686, 1479, 278, 757, 979, 1594, 717, 202, 739, 1509, 375, 1005, 258, 175, 178, 782, 722, 997, 1505, 1533, 1565, 143, 182, 901, 971, 1444, 1114, 42, 1002, 422, 61, 219, 1495, 990, 781, 456, 764, 38, 21, 760, 107, 203, 96, 64, 1425, 56, 29, 765, 452, 1612, 1503, 932, 1497, 244, 1519, 57, 948, 1541, 718, 1073, 961, 731, 935, 458, 1521, 304, 204, 228, 252, 356, 1000, 323, 156, 949, 1683, 248, 195, 310, 432, 898, 1498, 63, 1096, 763, 735, 393, 1539, 185, 436, 43, 289, 1112, 1032, 145, 384, 265, 426, 283, 247, 1525, 183, 1667, 966, 907, 1513, 255, 711, 328, 690]

players1 = []

for teamID in teamIDs:
	url1 = 'http://stats.nba.com/stats/commonteamroster/?'
	params1 = dict(
		Season="1997-98",
		TeamID=teamID
	)
	response = requests.get(url=url1, params=params1, headers=headers)
	print(response.json()['resultSets'][0]['rowSet'])
	players1 += response.json()['resultSets'][0]['rowSet']


for player in players1:
	playerIDs += [player[len(player) - 1]]
	print (playerIDs)

url = 'http://stats.nba.com/stats/shotchartdetail?'

params = dict(
    Period=0,
    VsConference="",
    LeagueID="00",
    LastNGames=0,
    TeamID=0,
    OpponentTeamID=0,
    Position="",
    Location="",
    Outcome="",
    DateFrom="",
    StartPeriod="",
    DateTo="",
    ContextFitler="",
    RangeType="",
    AheadBehind="",
    EndRange="",
    VsDivision="",
    SeasonSegment="",
    GameSegment="",
    RookieYear="",
    GameID="",
    ContextMeasure="FGA",
    Season="1997-98",
    PlayerID=playerIDs[0],
    Month=0,
    SeasonType="Regular Season",
    PlayerPosition=""
)

makebins = []
attemptbins = []

for x in range(0,50):
	makebins.append([])
	attemptbins.append([])
	for y in range(0, 47):
		makebins[x].append(0)
		attemptbins[x].append(0)

for playerID in playerIDs:
	params['PlayerID'] = playerID
	response = requests.get(url=url, params=params, headers=headers)
	shots = response.json()['resultSets'][0]['rowSet']

	print(playerID)
	if bool(shots):
		print(shots[0][4])

	for shot in shots:
		x = shot[17]
		y = shot[18]
		made = shot[20]
		if shot[12] == "3PT Field Goal":
			made *= 1.5
		if (y < 422.5):
			attemptbins[int((249.99-x)/10)][int((y+47.5)/10)] += 1
			makebins[int((249.99-x)/10)][int((y+47.5)/10)] += made

print(makebins)
print(attemptbins)

		
