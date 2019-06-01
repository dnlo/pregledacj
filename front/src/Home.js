import { Component } from "inferno";
import ListItem from "./ListItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "inferno-router";
import MagicGrid from "magic-grid";

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
    let selectedLength = this.props.selectedFeeds.length;
    console.log(selectedLength);

    // Manual scroll setup
    window.history.scrollRestoration = "manual";
    window.addEventListener("scroll", () => {
      window.sessionStorage.setItem("scroll", window.scrollY);
    });

    console.log(selectedLength);
    if (selectedLength < 1) {
      this.setState({
        emptyFeed: true
      });
    } else {
      this.setState({
        data: new Array(selectedLength)
      });
      this.magicGrid = new MagicGrid({
        container: "#feedList", // Required. Can be a class, id, or an HTMLElement.
        items: selectedLength,
        gutter: 0,
        useMin: true
      });
      // Ugly console errors because I can't find a way to stop the listening on component unmout
      // I've tried deleting the class instance, it doesn't work since in looks like it sets up an event listener with
      // the function bellow, should be a way to unsubscribe
      this.magicGrid.listen();
    }

    let feeds = this.props.feeds;
    console.log(this.props.selectedFeeds);
    this.props.selectedFeeds.map((l, i) => {
      if (l === "scroll") {
        return null;
      }
      return fetch(feeds[l])
        .then(res => res.json())
        .then(result => {
          // To keep the order of feeds
          // this is done so that going from a news page back to the feed sets the scroll position where it's supposed to be
          let data = this.state.data;
          data[i] = result;
          this.setState({
            data: data
          });
        });
    });
  }

  render() {
    let feeds = this.state.data;
    window.scrollTo(0, window.sessionStorage.getItem("scroll"));
    return (
      <div className="App">
        <div id="feedList" className="flex w-100 flex-wrap">
          {this.state.emptyFeed && (
            <h1 className="w-50 center tc mt5">
              <Link className="ba pa3 grow br-pill link" to="/birkaj">
                Odaberi nesto da citas
              </Link>
            </h1>
          )}
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
          })}
        </div>
      </div>
    );
  }
}

export default Home;
