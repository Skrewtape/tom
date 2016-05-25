#psql -U postgres poop -c "select division_machine_id, score.score, score.score_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = 1 order by division_machine_id"

psql -U postgres poop -c "DROP FUNCTION testing_papa_scoring(rank real);"

psql -U postgres poop -c "CREATE FUNCTION testing_papa_scoring(rank real) RETURNS real AS \$\$ BEGIN IF rank = 1 THEN RETURN 100; ELSIF rank = 2 THEN RETURN 90; ELSIF rank = 3 THEN RETURN 85; ELSIF rank < 88 THEN RETURN 100-rank-12; ELSIF rank >= 88 THEN RETURN 0; END IF; END; \$\$ LANGUAGE plpgsql;"

psql -U postgres poop -c "select entry_id, sum(entry_score) as entry_rank, player_id from (select entry.player_id, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = $1) as ss group by ss.entry_id,player_id order by entry_rank desc  limit 200"

psql -U postgres poop -c "select division_machine_id, score.score, score.entry_id, testing_papa_scoring(rank() over (partition by division_machine_id order by score.score desc)) as entry_score from score,entry where score.entry_id = entry.entry_id and division_id = $1 limit 200"


