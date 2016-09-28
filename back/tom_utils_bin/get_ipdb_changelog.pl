#!/usr/bin/perl
for($y=2016;$y>=2002;$y--){
#for($y=2016;$y>=2010;$y--){
    for($x=1;$x<=12;$x++){
        
	#`curl http://www.ipdb.org/changes.pl --data 'gid=&string=&date=$y-$x&finddate.x=5&finddate.y=7' > /tmp/output.temp.$y-$x.html`;
	#open(input1,"/tmp/output.temp.$y-$x.html");
	#open(output1,">/tmp/output.temp.$y-$x.non-unicode.html");	
	#while(<input1>){
	#    if($_=~ s/([^[:ascii:]]+)/ /g){
        #        print output1 $_;
	#    } else {
        #        print output1 $_;
	#    }
	#}
	
	#close input1;
	#close output1;
	
        
	#$results = `grep -oP '(?<=<a).+(?=</a>)' output.temp.$y-$x.non-unicode.html `;                
        open(input1,"/tmp/output.temp.$y-$x.non-unicode.html");
        print "opening $y-$x\n";
        while(<input1>){
            if($_=~ /.+<a(.+?)<\/a>/g){                
                $results=$results.$1."\n";
            }
        }
        #$results = `perl -ne 'while(/(?<=<a).+(?=<\\/a>)/g){print "$&\n";}' /tmp/output.temp.$y-$x.non-unicode.html`;        
	@results = split(/\n/,$results);
	for($z=0;$z<@results;$z++){
	    $results[$z]=~ s/ href=\"machine.cgi\?id=(.+?)\" target\=\"gid(.+?)\">(.+)/$3/;	    
	    $uid=$1;
	    if($results[$z]=~ /\</){
	    	$results[$z]=~ s/^(.+?)\<.+$/$1/;
	    }
	    $results[$z]=~ s/\'//g;
	    $results[$z]=~ s/\"//g;                        
            #$results_hash{$results[$z]}=$results_hash{$results[$z]}.",".$uid;
            $results_hash{$results[$z]}=$uid;
	    $results_hash2{$uid}=$results[$z];
	}
	
    }
}

$old_x = "FUCK";
foreach $x(sort(keys(%results_hash))){    
    $sorted_keys[@sorted_keys]=$x;	        
}

print '['."\n";
for($x=0;$x<@sorted_keys;$x++){
    if($x>0){
	if($sorted_keys[$x-1]+1 != $sorted_keys[$x]){
	    #	    print "OOPS! gap between $sorted_keys[$x-1] and $sorted_keys[$x] of ".(($sorted_keys[$x]-$sorted_keys[$x-1])-1)."\n";
	    if ($sorted_keys[$x]-$sorted_keys[$x-1]-1 < 10){
		$total_missing = $total_missing + $sorted_keys[$x]-$sorted_keys[$x-1] - 1;
	    } 
	}
    }
    
    if($sorted_keys[$x]=~ /href\=/ == 0){
	print "\{ \"_id\": \"$results_hash{$sorted_keys[$x]}\", \"key\": \"$results_hash{$sorted_keys[$x]}\",  \"machine_name\": \"$sorted_keys[$x]\" \}";
	if($x<@sorted_keys-1){
	    print ",";
	}    
	print "\n";
    }
}
print "]";
$total_count = @sorted_keys;
print "$total_count is count - $total_missing is missing\n"; 
