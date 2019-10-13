import Simple from "../components/Simple";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  foo: state.main.foo,
  bar: state.main.bar,
  teams: state.main.teams
});

const SimpleContainer = connect(mapStateToProps)(Simple);

export default SimpleContainer;
