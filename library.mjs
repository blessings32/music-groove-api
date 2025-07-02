const writeMeInLibray = document.querySelector(".write_me_in_libray");
const httpPostRequster = (type, body) => {
  let dataFromServer = "";
  let address = "http://localhost:3000/" + type;

  return fetch(address, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      bodyContent: body,
      timestamp: new Date().toISOString(),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      dataFromServer = data;
      return Promise.resolve(dataFromServer);
    })
    .catch((error) => console.log(error));
};
