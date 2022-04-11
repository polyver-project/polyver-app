export async function getAllRoverIds() {
  const res = await fetch("http://localhost:3000/api/rovers");
  const rovers = await res.json();

  return rovers.Items.map((rover) => {
    return {
      params: {
        id: rover.pk,
      },
    };
  });
}

export async function getRoverData(id) {
  const res = await fetch(
    `http://localhost:3000/api/rovers/${encodeURIComponent(id)}`
  );
  const rover = await res.json();

  if (Object.keys(rover).length === 0) return null;

  return {
    id,
    title: rover.Item.pk,
    streamurl: rover.Item.streamurl,
    isactive: rover.Item.isactive,
  };
}
