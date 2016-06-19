sleep $3
curl -o /tmp/test_out_$1.out -w "\npeekaboo - $1 - %{time_total}" http://$2:8000/results/division/1 > /tmp/time_$1.out 2>&1 &
