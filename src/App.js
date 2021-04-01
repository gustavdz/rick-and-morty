import React, { useEffect, useState } from "react";
import { getCharacter, getEpisode, getLocation } from "rickmortyapi";
import Card from "./components/Card";
import Tab from "./components/Tab";
import axios from "axios";

function App() {
  let aChars = [];
  let aEpisodes = [];
  let aLocations = [];
  let color = "blue";
  const [loaded, setLoaded] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [chars, setChars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [episodes_e, setEpisodes_e] = useState([]);
  const [charsInfo, setCharsInfo] = useState({});
  const [locationsInfo, setLocationsInfo] = useState({});
  const [episodesInfo, setEpisodesInfo] = useState({});
  const [charsString, setCharsString] = useState("");
  const [locationsString, setLocationsString] = useState("");
  const [episodesString, setEpisodesString] = useState("");
  const [executionTime, setExecutionTime] = useState(0);
  const [executionTime_e, setExecutionTime_e] = useState(0);
  const [openTab, setOpenTab] = useState(1);
  const [uniqueOriginsEpisodes, setUniqueOriginsEpisodes] = useState([]);

  //obtiene los episodios previo a obtener la informacion de los origenes de los personajes, para el ejercicio 2
  const fetchEpisodes = async () => {
    setLoaded(false);
    setFetched(false);
    for (let j = 1; j <= episodesInfo.pages; j++) {
      const episodes_data_e = await getEpisode({ page: j });
      episodes_data_e.results.forEach((record) => {
        aEpisodes.push(record);
      });
    }
    setEpisodes_e(aEpisodes);
    setLoaded(true);
    setFetched(true);
  };

  //obtiene la informacion de los origenes del personaje, para el ejercicio 2
  const fetchCharactersInfo = async () => {
    var start_e = +new Date();
    setLoaded(false);
    setFetched(false);

    //arregla formato de arreglo de episodios con la informacion necesaria
    const episode_characters = await Promise.all(
      episodes_e.map((epi) => {
        return {
          episode_id: epi.id,
          episode_name: epi.name,
          characters: epi.characters,
        };
      })
    );

    //creacion de objeto con los origenes de todos los personajes
    const origins = await Promise.all(
      episode_characters.map(async (episode) => {
        let episode_origin = [];
        //obtiene la informacion de origen de cada personaje
        const character_data = await Promise.all(
          episode.characters.map(async (url) => {
            const character_info = await axios.get(url, {
              "Content-Type": "application/json",
            });
            return {
              characterOrigin: character_info.data.origin.name,
            };
          })
        );
        episode_origin.episodeId = episode.episode_id;
        episode_origin.episodeName = episode.episode_name;
        episode_origin.origins = character_data;

        return episode_origin;
      })
    );

    //crea arreglo de objetos con los origenes de los personajes de cada episodio (sin repetir)
    const aUniqueOriginsEpisodes = await Promise.all(
      origins.map(async (episode) => {
        let oEpisodesOrigins = {};
        //elimina los origenes repetidos
        const aUniqueOrigin = await Promise.all(
          episode.origins.filter(
            (value, index, self) =>
              self.findIndex(
                (m) => m.characterOrigin === value.characterOrigin
              ) === index
          )
        );
        oEpisodesOrigins.episodeId = episode.episodeId;
        oEpisodesOrigins.episodeName = episode.episodeName;
        oEpisodesOrigins.origins = aUniqueOrigin;

        return oEpisodesOrigins;
      })
    );

    setUniqueOriginsEpisodes(aUniqueOriginsEpisodes);
    setLoaded(true);
    setFetched(true);
    var end_e = +new Date();
    setExecutionTime_e(end_e - start_e);
  };

  //obtiene la información para el ejercicio 1
  const fetchInitialData = async () => {
    var start = +new Date();
    setLoaded(false);
    setFetched(false);
    //obtiene los personajes de pagina en pagina
    for (let i = 1; i <= charsInfo.pages; i++) {
      const chars_data = await getCharacter({ page: i });
      chars_data.results.forEach((record) => {
        aChars.push(record);
      });
    }
    //obtiene los episodios de pagina en pagina
    for (let j = 1; j <= episodesInfo.pages; j++) {
      const episodes_data = await getEpisode({ page: j });
      episodes_data.results.forEach((record) => {
        aEpisodes.push(record);
      });
    }
    //obtiene los locations de pagina en pagina
    for (let y = 1; y <= locationsInfo.pages; y++) {
      const locations_data = await getLocation({ page: y });
      locations_data.results.forEach((record) => {
        aLocations.push(record);
      });
    }
    setChars(aChars);
    setEpisodes(aEpisodes);
    setLocations(aLocations);
    setLoaded(true);
    setFetched(true);
    var end = +new Date();
    setExecutionTime(end - start);
  };

  //obtiene la informacion de cantidades de paginas y totales de personajes, episodios y locations, para ejercicio 1
  useEffect(() => {
    const getInfo = async () => {
      const c_info = await getCharacter();
      const e_info = await getEpisode();
      const l_info = await getLocation();
      setCharsInfo(c_info.info);
      setEpisodesInfo(e_info.info);
      setLocationsInfo(l_info.info);
    };
    getInfo();
  }, []);

  //crea un string de todos los personajes, episodios y locaciones para luego contar los caracteres a buscar, para ejercicio 1
  useEffect(() => {
    if (fetched) {
      setCharsString(chars.map((c) => c.name).toString());
      setLocationsString(locations.map((l) => l.name).toString());
      setEpisodesString(episodes.map((e) => e.name).toString());
    }
    setFetched(false);
  }, [
    fetched,
    charsString,
    chars,
    locationsString,
    locations,
    episodesString,
    episodes,
  ]);

  //revisar los episodios con los origenes sin repetir
  useEffect(() => {
    if (fetched) {
      console.log(uniqueOriginsEpisodes);
    }
  }, [uniqueOriginsEpisodes, fetched]);

  return (
    <>
      <h1 className="text-blue-500 my-8 ml-6 text-5xl">
        Rick and Morty API - Test
      </h1>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <Tab
              openTab={openTab}
              setOpenTab={setOpenTab}
              color={color}
              tabNumber={1}
              title="1. Char Counter"
              target="#charcounter"
            />
            <Tab
              openTab={openTab}
              setOpenTab={setOpenTab}
              color={color}
              tabNumber={2}
              title="2. Episode Locations"
              target="#episodelocations"
            />
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div
                  className={openTab === 1 ? "block" : "hidden"}
                  id="charcounter"
                >
                  <div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 ml-6"
                      onClick={fetchInitialData}
                    >
                      Fetch Data
                    </button>
                    <hr />
                    {loaded &&
                      charsString.length > 0 &&
                      locationsString.length > 0 &&
                      episodesString.length > 0 && (
                        <>
                          <h1 className="text-blue-700 ml-6">Char counter</h1>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            {/* componentes para mostrar listado de personajes, locations y episodios */}
                            <Card
                              title="Characters"
                              data={chars}
                              count={charsInfo.count}
                              search="c"
                              dataString={charsString}
                              regexString="[^c]" //expresion regular que elimina todo caracter diferente al que se envia por regexString
                            />

                            <Card
                              title="Locations"
                              data={locations}
                              count={locationsInfo.count}
                              search="l"
                              dataString={locationsString}
                              regexString="[^l]" //expresion regular que elimina todo caracter diferente al que se envia por regexString
                            />

                            <Card
                              title="Episodes"
                              data={episodes}
                              count={episodesInfo.count}
                              search="e"
                              dataString={episodesString}
                              regexString="[^e]" //expresion regular que elimina todo caracter diferente al que se envia por regexString
                            />
                          </div>
                          <div className="mt-4 ml-6">
                            Execution Time: {executionTime} ms
                          </div>
                        </>
                      )}
                  </div>
                </div>
                <div
                  className={openTab === 2 ? "block" : "hidden"}
                  id="episodelocations"
                >
                  <div>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 ml-6"
                      onClick={fetchEpisodes}
                    >
                      Fetch Episodes
                    </button>
                    {/* 2do boton solo aparece luego de obtener todos los episodios */}
                    {episodes_e && episodes_e.length > 0 && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 ml-6"
                        onClick={fetchCharactersInfo}
                      >
                        Fetch Characters Origins Info
                      </button>
                    )}
                    <hr />
                    {loaded && episodes_e.length > 0 && (
                      <>
                        <h1 className="text-blue-700 text-3xl ml-6">
                          Episodes
                        </h1>
                        <ul>
                          {/* listado de episodios */}
                          {episodes_e.map((episode) => {
                            return (
                              <li key={episode.name}>
                                <h1 className="text-green-700 text-xl ml-6">
                                  {episode.name}
                                  {/* obtener el total de origins sn repetir de los personajes de ese episodio */}
                                  {uniqueOriginsEpisodes &&
                                    uniqueOriginsEpisodes.length > 0 && (
                                      <>
                                        {" ("}total:{" "}
                                        {
                                          uniqueOriginsEpisodes.filter(
                                            (epi) => {
                                              return (
                                                epi.episodeId === episode.id
                                              );
                                            }
                                          )[0].origins.length
                                        }
                                        {")"}
                                      </>
                                    )}
                                </h1>

                                <ul>
                                  {/* listado de origins de los personajes sin repetir de cada episodio */}
                                  {uniqueOriginsEpisodes &&
                                    uniqueOriginsEpisodes.length > 0 &&
                                    uniqueOriginsEpisodes
                                      .filter((epi) => {
                                        return epi.episodeId === episode.id;
                                      })
                                      .map((episode) => {
                                        return episode.origins.map((origin) => (
                                          <li key={origin.characterOrigin}>
                                            <h1 className="text-blue-900 text-xl ml-8">
                                              - {origin.characterOrigin}
                                            </h1>
                                          </li>
                                        ));
                                      })}
                                </ul>
                              </li>
                            );
                          })}
                          <div className="mt-4 ml-6">
                            Execution Time: {executionTime_e} ms
                          </div>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;
