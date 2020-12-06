function loadEnvironment()
{
	switch(Math.round(Math.random() * 100) % 4 + 1)
	{
	default:
	case 1:
		environment.innerHTML = "<a href='http://www.panda.org' target='_blank'><img border='0' src='http://www.orangesoftware.net/images/panda.gif'><br><strong>W</strong>orld <strong>W</strong>ildlife <strong>F</strong>und<a><br>Join the World Wildlife Fund's Passport program.";
		break;
	case 2:
		environment.innerHTML = "<a href='http://www.peta.org' target='_blank'><img border='0' src='http://www.orangesoftware.net/images/peta.gif'><a>";
		break;
	case 3:
		environment.innerHTML = "<a href='http://www.sierraclub.org' target='_blank'><img border='0' src='http://www.orangesoftware.net/images/sierraclub.gif'><a>";
		break;
	case 4:
		environment.innerHTML = "<a href='http://www.edf.org' target='_blank'><img border='0' src='http://www.orangesoftware.net/images/edf_logo.gif'><a>";
		break;
	case 5:
		environment.innerHTML = "<a href='http://www.voteenvironment.org' target='_blank'><img border='0' src='http://www.orangesoftware.net/images/voteenvironment.gif'><br>www.VoteEnvironment.org<a>";
		break;
	}
}
