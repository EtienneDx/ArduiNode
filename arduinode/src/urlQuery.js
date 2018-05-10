export default (query) => {
  query = query.includes("?") ? query.split('?')[1] : query;
  var ret = {};
  var entries = query.split('&');
  for (var i in entries) {
    const entry = entries[i];
    const kv = entry.split('=');
    ret[kv[0]] = kv[1];
  }
  return ret;
}
