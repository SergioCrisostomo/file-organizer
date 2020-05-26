const serverAdress = "http://localhost:8080";

const postSelections = (selections) => {
  return fetch(serverAdress + "/process-selections", {
    method: "post",
    body: JSON.stringify(selections),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
export default postSelections;
