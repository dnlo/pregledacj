import { Component } from "inferno";
import ListItem from "./ListItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {Link} from 'inferno-router'

dayjs.extend(relativeTime);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      emptyFeed: false,
      loading: true
    };
  }
  componentDidMount() {
    if (!this.props.selectedFeeds[0]) {
      this.setState({
        emptyFeed: true
      })
    }

    let feeds = this.props.feeds;

    this.props.selectedFeeds.map((l, i) => {
      return fetch(feeds[l])
        .then(res => res.json())
        .then(
          result => {
            this.setState({
              data: [result, ...this.state.data]
            });
          },
          error => {
            console.log(error)
          }
        );
    });
  }
  render() {
    let feeds = this.state.data
    return (
      <div className="App">
        <div id="feedList" className="flex w-100 flex-wrap">
        {this.state.emptyFeed && <h1 className="w-50 center tc mt5"><Link className="ba pa3 grow br-pill link" to="/birkaj">Odaberi nesto da citas</Link></h1>}
          {feeds.map(e => {
                return (
                  <ul className="list overflow-hidden pa0 w-50-m w-33-l ph3">
                    <h2>{Object.keys(e)[0]}</h2>
                    {Object.values(e)[0].map(f => {
                      return (
                        <ListItem
                          title={f.title}
                          link={f.link}
                          date={dayjs().to(dayjs(f.date))}
                        />
                      );
                    })}
                  </ul>
                );
              })
           }
        </div>
      </div>
    );
  }
}

export default Home;
