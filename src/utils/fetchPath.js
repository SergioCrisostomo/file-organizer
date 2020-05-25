const serverAdress = "http://localhost:8080";

const fetchPath = (path) => {
  return fetch(serverAdress + "/folder-selector?path=" + encodeURIComponent(path))
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
export default fetchPath;
