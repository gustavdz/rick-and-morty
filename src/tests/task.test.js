import { getCharacter, getEpisode, getLocation } from "rickmortyapi";

describe("Pruebas para el ejercicio 1", () => {
  test("la suma de la cantidad de C's en el nombre de cada personaje debe coincidir con el total mostrado", async () => {
    var aChars = [];
    const regexString = "[^c]";
    const regex = new RegExp(regexString, "gi");

    //obtiene los personajes de pagina en pagina
    const c_info = await getCharacter();

    //console.log(c_info.info.count);

    for (let i = 1; i <= c_info.info.pages; i++) {
      const chars_data = await getCharacter({ page: i });
      chars_data.results.forEach((record) => {
        aChars.push(record.name);
      });
    }

    const sum = await Promise.all(
      aChars.map((c) => {
        let results = [];
        results.c = c.replace(regex, "").length;
        return results.c;
      })
    );

    const total = sum.reduce((acum, cur) => {
      return acum + cur;
    }, 0);

    var sChars = aChars.toString();

    //haber obtenido todos los records
    expect(c_info.info.count).toBe(aChars.length);
    expect(total).toBe(sChars.replace(regex, "").length);
  }, 60000);

  test("la suma de la cantidad de L's en el nombre de cada locacion debe coincidir con el total mostrado", async () => {
    var aLocat = [];
    const regexString = "[^l]";
    const regex = new RegExp(regexString, "gi");

    //obtiene los personajes de pagina en pagina
    const l_info = await getLocation();

    for (let i = 1; i <= l_info.info.pages; i++) {
      const locations_data = await getLocation({ page: i });
      locations_data.results.forEach((record) => {
        aLocat.push(record.name);
      });
    }

    const sum = await Promise.all(
      aLocat.map((l) => {
        let results = [];
        results.l = l.replace(regex, "").length;
        return results.l;
      })
    );

    const total = sum.reduce((acum, cur) => {
      return acum + cur;
    }, 0);

    var sLocats = aLocat.toString();

    //haber obtenido todos los records
    expect(l_info.info.count).toBe(aLocat.length);
    expect(total).toBe(sLocats.replace(regex, "").length);
  }, 60000);

  test("la suma de la cantidad de E's en el nombre de cada episodio debe coincidir con el total mostrado", async () => {
    var aEpis = [];
    const regexString = "[^e]";
    const regex = new RegExp(regexString, "gi");

    //obtiene los personajes de pagina en pagina
    const e_info = await getEpisode();

    for (let i = 1; i <= e_info.info.pages; i++) {
      const episodes_data = await getEpisode({ page: i });
      episodes_data.results.forEach((record) => {
        aEpis.push(record.name);
      });
    }

    const sum = await Promise.all(
      aEpis.map((epi) => {
        let results = [];
        results.e = epi.replace(regex, "").length;
        return results.e;
      })
    );

    const total = sum.reduce((acum, cur) => {
      return acum + cur;
    }, 0);

    var sEpis = aEpis.toString();

    //haber obtenido todos los records
    expect(e_info.info.count).toBe(aEpis.length);
    expect(total).toBe(sEpis.replace(regex, "").length);
  }, 60000);
});
