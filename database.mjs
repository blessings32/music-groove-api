import query from "./myModules/dbQuery.mjs";

export async function getArtistPofile(artistName) {
  const [artistRow] = await query(
    "SELECT id, artist_profile_photo FROM artists WHERE stage_name = ?",
    [`${artistName}`]
  );
  console.log("artist name:", artistName);
  if (!artistRow) return null;
  const artistId = artistRow.id;
  const coverphoto = artistRow.artist_profile_photo;

  const popular = await query(
    `SELECT 
    		ranked.title, 
		ranked.year, 
		COALESCE(a.album, 'Single') as album,
		ranked.track_id,
		ranked.file_path as trackpath,
		ranked.artist_id,
		alb.id AS album_id,
      COALESCE(ranked.location, alb.album_cover) as location
      FROM (
		SELECT t.artist_id, 
		t.title, 
		t.release_year as year, 
		album, 
		t.artwork as location,
		t.track_id,
		t.file_path,
		
        RANK() OVER (PARTITION BY t.artist_id ORDER BY t.popularity DESC) AS rankk
        FROM tracks t
      ) ranked
      LEFT JOIN albums a ON ranked.album = a.id
      LEFT JOIN albums alb ON ranked.album = alb.id
      WHERE ranked.rankk <= 9 AND ranked.artist_id = ?
      LIMIT 9`,
    [artistId]
  );

  const album = await query(
    `SELECT id as album_id, release_year as year, album, album_cover as location
      FROM albums WHERE artist_id = ?`,
    [artistId]
  );
  const latest = await query(
    `SELECT id,release_year as year, COALESCE(" ") AS title, album, album_cover as location
      FROM albums WHERE artist_id = ? AND release_year = 2022 LIMIT 1`,
    [artistId]
  );
  const discover = await query(
    `SELECT 
    		t.title, 
		t.track_id,
		a.id AS album_id,
		t.artist_id,
		t.file_path as trackpath,
		ar.stage_name as artist,
		t.release_year as year, 
		COALESCE(a.album, 'Single') as album,
      	COALESCE(
			t.artwork,
        		(SELECT 
				album_cover FROM albums 
				WHERE id = (SELECT album FROM tracks WHERE track_id = t.track_id)),
        		"./images/artwork/metro_boomin.PNG") as location
      FROM tracks t
      LEFT JOIN albums a ON t.album = a.id
	LEFT JOIN artists ar ON t.artist_id = ar.id
      WHERE t.artist_id != ?
      ORDER BY RAND()
      LIMIT 6`,
    [artistId]
  );

  const artist = [{ artist: artistName, coverphoto }];
  return [artist, popular, latest, discover, album];
}
export async function getHomePlaylist() {
  const rows = await query(`
		SELECT CONCAT( t.title, IF( t.featured_artist IS NOT NULL AND t.featured_artist != '', CONCAT(' feat. ', t.featured_artist), 
            '')) AS title,
		t.track_id,
		t.artist_id,
		t.file_path as trackpath,
    a.stage_name AS artist,
    t.file_path AS location,
    COALESCE(alb.album, 'Single') AS albumstatus,
    COALESCE(t.artwork, alb.album_cover) AS artwork
FROM tracks t
LEFT JOIN artists a ON t.artist_id = a.id
LEFT JOIN albums alb ON t.album = alb.id
ORDER BY RAND()
LIMIT 10;`);
  return rows;
}
export async function getNewTracks() {
  const rows = await query(`
		SELECT 
  title,
  artist,
  filepath,
  albumstatus,
  artwork
FROM (
  SELECT 
    CONCAT(t.title, IF(t.featured_artist IS NOT NULL AND t.featured_artist != '', CONCAT(' feat. ', t.featured_artist), '')) AS title,
    a.stage_name AS artist,
    t.file_path AS filepath,
    COALESCE(alb.album, 'Single') AS albumstatus,
    COALESCE(t.artwork, alb.album_cover) AS artwork,
    t.release_year,
    alb.album,
    ROW_NUMBER() OVER (PARTITION BY alb.album ORDER BY RAND()) AS rn
  FROM tracks t
  LEFT JOIN artists a ON t.artist_id = a.id
  LEFT JOIN albums alb ON t.album = alb.id
  WHERE t.release_year >= 2024
) ranked
WHERE rn <= 3
ORDER BY RAND()
LIMIT 10;`);
  return rows;
}

export async function getArtists() {
  const rows = await query(
    `select stage_name as artist, artist_profile_photo as artwork from artists limit 20;`
  );
  return rows;
}
export async function getAlbums() {
  const rows = await query(`
		SELECT id as album_id, release_year as year, album, album_cover as artwork
		FROM albums
		LIMIT 10;
	`);
  return rows;
}
export async function setRecentPlay(userid, trackid) {
  query(`INSERT INTO recently_played (user_id, track_id) VALUES (?, ?)`, [
    userid,
    trackid,
  ]);
}

export async function getRecentPlay(userid) {
  let p = await query(
    `SELECT 
  title,
  artist,
  trackpath,
  albumstatus,
  artwork,
  track_id, 
  artist_id,
  duration,
  album_id,
  albumstatus as album
  FROM (
  SELECT 
    CONCAT(t.title, IF(t.featured_artist IS NOT NULL AND t.featured_artist != '', CONCAT(' feat. ', t.featured_artist), '')) AS title,
    a.stage_name AS artist,
    t.file_path AS trackpath,
    COALESCE(alb.album, 'Single') AS albumstatus,
    COALESCE(t.artwork, alb.album_cover) AS artwork,
    t.release_year,
    t.track_length as duration,
    alb.album,
    alb.id as album_id,
    rp.user_id,
    rp.played_at,
	t.track_id AS track_id,
	a.id as artist_id,
    ROW_NUMBER() OVER (PARTITION BY t.track_id ORDER BY rp.played_at) AS rn
  FROM tracks t
  LEFT JOIN artists a ON t.artist_id = a.id
  LEFT JOIN albums alb ON t.album = alb.id
  LEFT JOIN recently_played rp ON rp.track_id = t.track_id
) ranked
 WHERE ranked.user_id = ?  AND rn = 1
  
ORDER BY ranked.played_at
LIMIT 10;`,
    [userid]
  );
  const tracks = p.map((track, i) => ({
    ...track,
    index: i + 1,
  }));
  return tracks;
}
export async function getAlbumById(id) {
  const albumInfo = await query(
    `SELECT 
	ar.stage_name AS artist,
    	a.album AS albumname, 
	a.runtime, 
	a.total_tracks AS albumlength, 
	a.release_year AS year, 
	a.album_cover as albumcover
	FROM albums a
	LEFT JOIN artists ar ON a.artist_id = ar.id
	WHERE a.id = ?`,
    [id]
  );

  const albumTracks = await query(
    `SELECT 
		t.track_id,
		t.title, 
		t.track_length as duration,
		COALESCE(t.featured_artist, " ") as artist, 
		t.file_path AS trackpath,
		t.artist_id 
		FROM tracks t
		WHERE album = ?`,
    [id]
  );
  const albumTracksUdate = albumTracks.map((track, i) => ({
    ...track,
    index: i + 1,
  }));
  const file = [albumInfo, albumTracksUdate];
  return file;
}
export async function getAllTracks() {
  const rows = await query(`
		SELECT
		t.track_id,
		t.track_length as duration,
		COALESCE(alb.album, 'Single') AS album,
		t.file_path as trackpath,
		a.stage_name as artist,
		t.title,
		a.id as artist_id,
		COALESCE(t.artwork, alb.album_cover) AS artwork
		FROM tracks t
		LEFT JOIN artists a ON t.artist_id = a.id
		LEFT JOIN albums alb ON t.album = alb.id
		ORDER BY RAND()
		`);
  const tracks = rows.map((track, i) => ({
    ...track,
    index: i + 1,
  }));
  return tracks;
}
