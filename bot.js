require("dotenv").config();

const Discord = require("discord.js");
const buildPdf = require("./report/builder");
const fs = require("fs");
const client = new Discord.Client();

const store = {
  date: {
    day: NaN,
    month: NaN,
    year: NaN
  },
  singUp: [],
  points: [],
  tasks: []
};

const methods = [
  {
    name: "addTarefa",
    func: args => {
      let taskObject = {
        task: args[0],
        manager: args[1],
        deadline: args[2]
      };
      store.tasks.push(taskObject);
      return `Tarefa adicionada: ${taskObject.task}`;
    }
  },
  {
    name: "setData",
    func: args => {
      let dateObject = {
        day: args[0],
        month: args[1],
        year: args[2]
      };
      store.date = dateObject;
      return `Data Estabelecida: ${dateObject.day} / ${dateObject.month} / ${dateObject.year}`;
    }
  },
  {
    name: "addPonto",
    func: args => {
      let taskObject = {
        point: args[0],
        description: args[1]
      };
      store.points.push(taskObject);
      return `Ponto de discussão adicionado: ${taskObject.point}`;
    }
  },
  {
    name: "addParticipante",
    func: args => {
      args.forEach(person => {
        store.singUp.push(person);
      });
      return args.length == 1 ? "Pessoa Adicionada" : "Pessoas Adicionadas";
    }
  },
  {
    name: "tarefas",
    func: () => {
      return store.tasks.length == 0
        ? "Sem Tarefas"
        : store.tasks.map(task => task.task);
    }
  },
  {
    name: "pontos",
    func: () => {
      return store.points.length == 0
        ? "Sem pontos discutidos no momento"
        : store.points.map(point => point.point);
    }
  },
  {
    name: "presentes",
    func: () => {
      return store.singUp.length == 0
        ? "Sem presentes no momento"
        : store.singUp.map(person => person);
    }
  },
  {
    name: "gerarpdf",
    func: () => {
      buildPdf(store);
      return "Ata gerada com sucesso";
    }
  },
  {
    name: "enviarpdf"
  },
  {
    name: "oi",
    func: () => "Olá, eu sou CobralcBot e estou pronto"
  },
  {
    name: "funções",
    func: () =>
      "Sou feito para fazer atas de reuniões. Digite !setDate-Dia-Mês-Ano para definir a data. digite !addParticipante-Nome do Participante 1-Nome do participante 2 - ... para adicionar participantes. Digite !addPonto-Ponto-Descrição para adicionar um ponto na ata. Digite !addTarefa-Tarefa-Responsável-Prazo para definir uma tarefa. Quando tudo estiver pronto digite !gerarpdf e depois !enviar pdf. Muito obrigado por estar no Cobralc. Mereço uma moeda pela eficiência?"
  },
  {
    name: "funçõesresumo",
    func: () =>
      "!setData / !addParticipante / !participantes / !addPonto / !pontos / !addTarefa / !tarefas / !gerarpdf / !enviarpdf"
  }
];

handle = function(nameFunc, args) {
  let obj = methods.find(method => method.name == nameFunc);
  return obj.func(args);
};

client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.TOKEN);

client.on("message", message => {
  if (message.content.startsWith(process.env.PREFIX)) {
    let args = message.content.split("-");
    let command = args[0].substring(1);
    let params = args.slice(1);

    if (methods.some(method => method.name == command)) {
      if (command == "enviarpdf") {
        const buffer = fs.readFileSync(
          `./atacobralc${store.date.day}-${store.date.month}-${store.date.year}.pdf`
        );
        const attachment = new Discord.Attachment(
          buffer,
          `./atacobralc${store.date.day}-${store.date.month}-${store.date.year}.pdf`
        );
        message.channel.send(
          `Estou preparando a ata da reunião do dia ${store.date.day}-${store.date.month}-${store.date.year}`
        );
        message.channel.send("Pdf Enviado", attachment);
      } else {
        message.channel.send(`${handle(command, params)}`);
      }
    } else {
      message.channel.send(`Não entendi`);
    }
  }
});
