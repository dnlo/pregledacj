export default ({ date, link, title }) => {
  return (
    <li className="mv2">
      <a className="link" href={link}>{title}</a><br/>
      <small>{date}</small>
    </li>
  );
};
