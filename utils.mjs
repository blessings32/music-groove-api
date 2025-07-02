const replaceTemp = (temp, field) => {
  let output = temp.replace(/{%TITLE%}/g, field.title);
  output = output.replace(/{%ARTIST%}/g, field.artist);
  output = output.replace(/{%LOCATION%}/g, field.location);
  output = output.replace(/{%ALBUM%}/g, field.album);
  output = output.replace(/{%ARTWORK%}/g, field.artwork);
  output = output.replace(/{%ALBUMSTATUS%}/g, field.albumstatus);
  output = output.replace(/{%PLAYLIST%}/g, field.playlist);
  output = output.replace(/{%ALBUMCOVER%}/g, field.albumcover);
  output = output.replace(/{%ALBUMNAME%}/g, field.albumname);
  output = output.replace(/{%ALBUMLENGTH%}/g, field.albumlength);
  output = output.replace(/{%RUNTIME%}/g, field.runtime);
  output = output.replace(/{%YEAR%}/g, field.year);
  output = output.replace(/{%COVERPHOTO%}/g, field.coverphoto);
  output = output.replace(/{%TRACKID%}/g, field.track_id);
  output = output.replace(/{%TRACKPATH%}/g, field.trackpath);
  output = output.replace(/{%ARTISTID%}/g, field.artist_id);
  output = output.replace(/{%ALBUMID%}/g, field.album_id);
  output = output.replace(/{%DURATION%}/g, field.duration);
  output = output.replace(/{%INDEX%}/g, field.index);
  return output;
};

//replacing templates; takes json file and template with {%}
export function templateReplacer(JSONObject, template) {
  try {
    return JSONObject.map((el) => replaceTemp(template, el)).join("");
  } catch (err) {
    console.log(err);
  }
}
