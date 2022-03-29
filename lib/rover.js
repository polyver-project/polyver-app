export async function getAllRoverIds() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const rovers = await res.json();
  return rovers.map((rover) => {
    return {
      params: {
        id: rover.id.toString(),
      },
    };
  });
}

export async function getRoverData(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const rover = await res.json();

  if (Object.keys(rover).length === 0) return null;

  return {
    id,
    title: rover.name,
  };
}
