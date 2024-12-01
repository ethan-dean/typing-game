import Game from '../components/Game';

const NewGame = () => 
{

	return(
		<div>
		<section className="wrapper">
            <div id='star1'></div>
            <div id='star2'></div>
            <div id='star3'></div>
        </section>
			<Game/>
		</div>
		);
};

export default NewGame;