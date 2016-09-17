curl -s -o /tmp/test_out_$1.out -w "\npeekaboo - $1 - %{time_total}" http://localhost:8000/division_entries_ex/$1 > /tmp/new_time_$1.out 2>&1 &
