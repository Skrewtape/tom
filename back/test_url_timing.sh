sleep .2
curl -o /tmp/test_out_$1.out -w "\npeekaboo - $1 - %{time_total}" http://localhost:8000/results/player/1 > /tmp/time_$1.out 2>&1 &
