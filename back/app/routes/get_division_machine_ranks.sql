psql -U postgres poop -c "select score.score,entry.division_id,score.division_machine_id,rank() over (partition by division_machine_id order by score.score asc) from score,entry where score.entry_id = entry.entry_id and entry.completed = true and division_machine_id in (select division_machine_id from division_machine where division_id = 1) order by division_machine_id,score.score" > /tmp/out
