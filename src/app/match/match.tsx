import { Component, h } from "preact";
import { PlayersApi } from "../api/players.api";
import { MatchTeam } from "./match-team";
import { IMatchStateModel, IMatchTeamModel, IPlayer } from "./match.model";

export class Match extends Component {
    players: IPlayer[] = [];

    state: IMatchStateModel = {
        match: {
            teams: [
                {
                    team: 0,
                    players: [
                        { position: 0, name: "", username: "" },
                        { position: 1, name: "", username: "" }
                    ],
                    score: 0
                },
                {
                    team: 1,
                    players: [
                        { position: 0, name: "", username: "" },
                        { position: 1, name: "", username: "" }
                    ],
                    score: 0
                }
            ]
        },
        availablePlayers: this.players
    };

    componentDidMount() {
        PlayersApi.getPlayers().then(players => {
            this.players = players;
            this.setState({ availablePlayers: this.players });
        });
    }

    teamChange = (addMatchTeam: IMatchTeamModel) => {
        const match = this.state.match;
        match.teams[addMatchTeam.team] = addMatchTeam;
        const availablePlayers = this.players.filter(player => !this.state.match.teams.map(team => team.players.map(matchPlayer => matchPlayer.username)).reduce((acc, val) => acc.concat(val), []).includes(player.username));

        this.setState({
            availablePlayers,
            match
        });
    }

    render() {
        const match = (
            <div class="match">
                {!!this.players.length && this.state.match.teams.map(team => <MatchTeam key={team.team} team={team} players={this.state.availablePlayers} onTeamChange={this.teamChange} />)}
            </div>
        );

        return match;
    }
}