export default async (type, body) => {
  let dataFromServer = "";
  let address = "http://localhost:3000/" + type;

  try {
    const response = await fetch(address, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bodyContent: body,
        timestamp: new Date().toISOString(),
      }),
    });
    const data = await response.json();
    dataFromServer = data;
    return await Promise.resolve(dataFromServer);
  } catch (error) {
    return console.log(error);
  }
};
