export async function loadAllPages(getPage, getItems) {
  const items = [];
  for await (const result of loadEachPage(getPage)) {
    items.push(...getItems(result));
  }

  return items;
}

export async function* loadEachPage(getPage) {
  let pageToken;
  do {
    const {result} = await getPage(pageToken);
    yield result;
    pageToken = result.nextPageToken;
  } while (pageToken);
}
