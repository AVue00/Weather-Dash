import fs from "node:fs/promises"

// TODO: Define a City class with name and id properties
class City {
  name: string
  id: string

  constructor(name: string, id: string) {
    this.name = name
    this.id = id
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile("db/db.json",{
      flag: "a+",
      encoding: "utf8",
    })
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile("db/db.json", JSON.stringify(cities, null, "\t"))
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((data) => {
      let formatted_cities: City[]
      formatted_cities = [].concat(JSON.parse(data)??[])
      return formatted_cities
    })
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    // Get all cities and save to a variable, then perform code similar to line 28
    const cities = await this.getCities();
    cities.push(new City(city, (cities.length + 1).toString()));
    await this.write(cities);
    }
  async removeCity(id: string) {
    const cities = await this.getCities();
    const newCities = cities.filter((city) => city.id !== id);
    await this.write(newCities);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file



export default new HistoryService();
