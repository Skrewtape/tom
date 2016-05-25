psql -U postgres poop -c "select division_id,entry_id, rank() over (partition by division_id order by entry_score), entry_score from (select score.entry_id,rank() over (partition by division_id order by score.score asc) as entry_score, division_id from score,entry where score.entry_id = entry.entry_id) as ss group by entry_id,entry_score,division_id order by division_id,entry_score;"

