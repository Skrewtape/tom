# An explanation of the SQL queries used for ranking players and entries

## Goals
We need to get the following rankings 
* For each machine in a division, we need to rank all scores on that machine and assign appropriate number of points to each score
* For each division, we need a ranking of tickets (based on the sum of the points for each score in a ticket)
* For each player, we need a listing of all entrys in all divisions for that user 

## Ranking scores by machine (PAPA scoring)
Here's the plain english of what we need to do for all machines in a division :
* Get a list of all scores for a given machine ( where the score is part of a ticket that was completed and not voided )
* Order the scores in descending order
* Start at the top of the list (i.e. the highest score) and assign a rank starting at 1
* Assign each score points based on the rank (i.e. rank 1 gets 100 points, 2 90, etc)

The query in the method get_scores_ranked_by_machine() in results.py does this.  The end result is a list of scores for a given division with "points" assigned for each score - the scores are ordered and ranked for each DivisionMachine in the Division.

There are two parts in the query that need explanation :
* the "rank() over (....)" part
* the "testing_papa_scoring()" function

The "rank() over (....)" part is a postgress function ( documentation here : [postgres window functions](https://www.postgresql.org/docs/9.5/static/tutorial-window.html) ).  The short story : the rank() function generates a rank for all rows returned in the query, using parameters in the parenthesis to determine how to do the ranking.  In this case, the rows are subdivided by division_machine_id and ordered by scores for each division_machine_id.

The "testing_papa_scoring()" is a postgres stored procedure - it takes a rank, and returns the appropriate number of points for that rank.  See the [INSTALL_INSTRUCTIONS.md](INSTALL_INSTRUCTIONS.md) for the definition.

## Ranking scores by machine (HERB scoring)

FILL ME IN

## Ranking entries for a division (PAPA scoring)
Here is the plain english of what we need to do
* For each ticket (that is not voided or in progress), get the sum of the points for all scores on the ticket
* Order the tickets by that sum of points
* Start at the top of the list (i.e. the highest score) and assign a rank starting at 1

The query in the method get_ranked_division_entries() in results.py does this.  The end results is a list of entries for a given division - the entries are ordered and ranked based on the sum of "points" for all the scores in the entry.

There is one thing to notice about this query : it uses a subquery wrapped in a subquery.  This is needed because of the fact that we want to sum a field that depends on the rank function.

Let's look at the first subquery (i.e. the one nested the deepest).  This is similar to the query from get_scores_ranked_by_machine().  We'd like to just sum the results of the testing_papa_scoring() function for each entry, but we can't - postgres won't let you directly sum the output of the rank function ( which makes sense - the rank isn't available till everything else is done in the query - including any sum() operations ).  So, we wrap this query in a new query which does the summing for each entry, and limits the number of entries we return to 200.  This new query is then wrapped by the top level query, which assigns a rank to each entry based on the summed points for each ticket.

## Ranking entries for a division (HERB scoring)

FILL ME IN


## All entries for all divisions for a given user

FILL ME IN

