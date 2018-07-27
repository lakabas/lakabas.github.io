import urllib
import time
import os
import math

class CityWebsite:
	def __init__(self, city_name, url, file_name_base, end_page):
		self.city_name = city_name
		self.url = url
		self.file_name_base = file_name_base
		self.end_page = end_page

	def __repr__(self):
		return "\n" + self.city_name + "\n" + self.url + "\n" + self.file_name_base + "\n" + str(self.end_page)



# both loops starting on index 1
def getWebPages(city_website_arr):
	wait_time = 5
	howLong(city_website_arr, wait_time)
	if not os.path.exists("infocities"):
		os.makedirs("infocities")
	for i in range(1, len(city_website_arr) + 1):
		city_website = city_website_arr[i - 1]
		end_page = city_website.end_page
		file_name_base = city_website.file_name_base
		url = city_website.url
		for j in range(1, city_website.end_page + 1):
			if not os.path.exists("infocities/" + file_name_base):
				os.makedirs("infocities/" + file_name_base)

			fullfilename = os.path.join("infocities/" + file_name_base + "/", file_name_base + str(j) + ".txt")
			new_url = url + "/" + str(j)
			urllib.urlretrieve(new_url, fullfilename)
			print(url + "/" + str(j))
			time.sleep(wait_time)

def howLong(city_website_arr, wait_time):
	total_pages = 0
	for x in range(0, len(city_website_arr)):
		total_pages = total_pages + city_website_arr[x].end_page

	print("array length: " + str(len(city_website_arr)))
	print("total pages: " + str(total_pages))


	total_seconds = total_pages * wait_time
	total_minutes = total_seconds / 60
	total_hours = total_minutes / 60

	print("total minutes: " + str(total_minutes))

	hours = int(math.floor(total_hours))
	minutes = int(total_minutes - (hours * 60))

	print("This will take " + str(hours) + " hrs and " + str(minutes) + " min")

city_website_arr = []

def pretty_append(name, url, short, end_page):
	city_website_arr.append(CityWebsite(name, url, short, end_page))

def themain():
	# pretty_append("New York", 'https://www.emporis.com/city/101028/new-york-city-ny-usa/status/existing', "nyc", 160)
	# pretty_append("Seattle", "https://www.emporis.com/city/101046/seattle-wa-usa/status/existing", "seattle", 19)
	# pretty_append("Philadelphia", "https://www.emporis.com/city/101032/philadelphia-pa-usa/status/existing", "philly", 20)
	# pretty_append("Chicago", "https://www.emporis.com/city/101030/chicago-il-usa/status/existing", "chicago", 67)
	# pretty_append("Miami", "https://www.emporis.com/city/101321/miami-fl-usa/status/existing", "miami", 20)
	pretty_append("Houston", "https://www.emporis.com/city/101031/houston-tx-usa/status/existing", "houston", 18)
	pretty_append("Los Angeles", "https://www.emporis.com/city/101029/los-angeles-ca-usa/status/existing", "la", 14)
	pretty_append("San Francisco", "https://www.emporis.com/city/101040/san-francisco-ca-usa/status/existing", "sanfran", 26)W
	pretty_append("Phoenix", "https://www.emporis.com/city/101034/phoenix-az-usa/status/existing", "phoenix", 9)
	pretty_append("Boston", "https://www.emporis.com/city/101045/boston-ma-usa/status/existing", "boston", 16)
	getWebPages(city_website_arr)

themain()


