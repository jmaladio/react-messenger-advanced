import React from "react";
import "./styles.css";
import { v1 as uuidv1 } from "uuid";
import Emoji from "a11y-react-emoji";

export default function App() {
  return (
    <div className="App">
      <ListaMensajes />
    </div>
  );
}

const mensajeros = [
  {
    name: "left",
    input: ""
  },
  {
    name: "center",
    input: ""
  },
  {
    name: "right",
    input: ""
  }
];

// Main stateful component
class ListaMensajes extends React.Component {
  state = {
    mensajeros,
    mensajes: []
  };

  handleOnChange = e => {
    const mensajeros = this.state.mensajeros.map(mensajero => {
      if (mensajero.name === e.target.name) {
        return {
          name: mensajero.name,
          input: e.target.value
        };
      } else {
        return mensajero;
      }
    });

    this.setState({ mensajeros });
  };

  handleOnClickSubmit = mensajeroName => {
    let mensajeroInput;
    const mensajeros = this.state.mensajeros.map(mensajero => {
      if (mensajero.name === mensajeroName) {
        mensajeroInput = mensajero.input;
        return {
          name: mensajero.name,
          input: ""
        };
      } else {
        return mensajero;
      }
    });

    // Update the state ONLY IF mensajeroInput is not an empty string
    if (mensajeroInput) {
      this.setState(prevState => {
        return {
          mensajeros,
          mensajes: [
            ...prevState.mensajes,
            {
              userName: mensajeroName,
              id: uuidv1(),
              body: mensajeroInput,
              read: false
            }
          ]
        };
      });
    }
  };

  handleClickDelete = mensajeId => {
    this.setState(prevState => {
      return {
        mensajeros,
        mensajes: prevState.mensajes.filter(mensaje => mensaje.id !== mensajeId)
      };
    });
  };

  handleClickRead = mensajeId => {
    this.setState(
      prevState => {
        return {
          mensajeros,
          mensajes: prevState.mensajes.map(mensaje => {
            if (mensaje.id === mensajeId) {
              return {
                userName: mensaje.userName,
                id: mensaje.id,
                body: mensaje.body,
                read: true
              };
            } else {
              return mensaje;
            }
          })
        };
      },
      () => console.log(this.state.mensajes)
    );
  };

  render() {
    return (
      <div className="lista-mensajeros">
        <h1 className="lista-mensajeros__heading">Mensajes recibidos</h1>
        <div className="lista-mensajeros__mensajes">
          {this.state.mensajes.map(mensaje => (
            <p
              key={mensaje.id}
              className={`lista-mensajeros__paragraphs ${mensaje.read &&
                "read"}`}
            >
              {mensaje.body}
            </p>
          ))}
        </div>
        <div className="lista-mensajeros__wrapper">
          {this.state.mensajeros.map(mensajero => {
            return (
              <Mensajero
                key={mensajero.name}
                valueInput={mensajero.input}
                mensajeroName={mensajero.name}
                onUserInput={this.handleOnChange}
                onUserSubmit={this.handleOnClickSubmit}
                mensajes={this.state.mensajes}
                onClickDelete={this.handleClickDelete}
                onClickRead={this.handleClickRead}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

//Componente ListaMensajeros -> Mensajero
const Mensajero = props => {
  const {
    valueInput,
    onUserInput,
    onUserSubmit,
    mensajes,
    mensajeroName,
    onClickDelete,
    onClickRead
  } = props;
  return (
    <div className="mensajero">
      <h2 className="mensajero__heading">Mensajero</h2>
      <Form
        valueInput={valueInput}
        mensajeroName={mensajeroName}
        onUserInput={onUserInput}
        onUserSubmit={onUserSubmit}
      />
      <MensajesEnviados
        mensajes={mensajes}
        mensajeroName={mensajeroName}
        onClickDelete={onClickDelete}
        onClickRead={onClickRead}
      />
    </div>
  );
};

// Componente ListaMensajeros -> Mensajero -> Formulario
const Form = props => {
  const { valueInput, mensajeroName, onUserInput, onUserSubmit } = props;
  return (
    <div className="mensajero__form">
      <input
        name={mensajeroName}
        type="text"
        value={valueInput}
        onChange={onUserInput}
        placeholder="Escriba aquí..."
      />
      <button onClick={() => onUserSubmit(mensajeroName)}>Enviar</button>
    </div>
  );
};

// Componente ListaMensajeros -> Mensajero -> MensajesEnviados
const MensajesEnviados = props => {
  const { mensajes, mensajeroName, onClickDelete, onClickRead } = props;
  return (
    <div className="mensajes-enviados">
      <h3 className="mensajes-enviados__heading">Mensajes enviados</h3>
      {mensajes
        .filter(mensaje => mensaje.userName === mensajeroName)
        .map(mensaje => (
          <Mensajes
            key={mensaje.id}
            mensajeId={mensaje.id}
            mensajeBody={mensaje.body}
            mensajeroName={mensajeroName}
            onClickDelete={onClickDelete}
            onClickRead={onClickRead}
          />
        ))}
    </div>
  );
};

// Componente ListaMensajeros -> Mensajero -> MensajesEnviados -> Mensajes
const Mensajes = props => {
  const {
    mensajeId,
    mensajeBody,
    /* mensajeroName, */ onClickDelete,
    onClickRead
  } = props;

  const emotesStyle = {
    cursor: "pointer"
  };

  return (
    <div className="mensaje">
      <p className="mensaje__paragraph">{mensajeBody}</p>
      <div className="mensaje__emotes">
        <Emoji
          symbol="👀"
          label="eyes"
          style={emotesStyle}
          onClick={() => onClickRead(mensajeId)}
        />
        <Emoji
          symbol="💣"
          label="bomb"
          style={emotesStyle}
          onClick={() => onClickDelete(mensajeId)}
        />
      </div>
    </div>
  );
};
