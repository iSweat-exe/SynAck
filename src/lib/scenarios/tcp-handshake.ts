import type { Scenario } from "@/lib/protocol-diagram";

// The TCP three-way handshake, then the first data. Written as data so it can move to the CMS.
export const tcpHandshake: Scenario = {
  id: "tcp-handshake",
  title: "TCP : le handshake",
  summary:
    "Avant d'échanger des données, un client et un serveur TCP s'accordent sur des numéros de séquence en trois messages : SYN, SYN-ACK, ACK.",
  actors: [
    { id: "client", label: "Client", sublabel: "ton navigateur" },
    { id: "server", label: "Serveur", sublabel: "le site" },
  ],
  initialStates: { client: "CLOSED", server: "LISTEN" },
  steps: [
    {
      from: "client",
      to: "server",
      label: "SYN",
      detail: "seq = x",
      tone: "primary",
      note: "Le client veut ouvrir une connexion. Il envoie un segment SYN avec un numéro de séquence de départ, x, choisi au hasard.",
      states: { client: "SYN_SENT", server: "SYN_RECEIVED" },
    },
    {
      from: "server",
      to: "client",
      label: "SYN-ACK",
      detail: "seq = y, ack = x + 1",
      tone: "primary",
      note: "Le serveur accepte. Il répond avec son propre numéro de séquence, y, et confirme le SYN du client avec ack = x + 1 (le prochain octet qu'il attend).",
      states: { client: "ESTABLISHED" },
      lossy: {
        lostNote:
          "Le SYN-ACK se perd en route : le réseau n'est pas fiable. Le client ne reçoit rien et reste en attente.",
        waitNote:
          "Le serveur n'a pas reçu d'ACK. Quand son délai de retransmission expire, il comprend que son message a dû se perdre.",
        retransmitNote:
          "Le serveur renvoie le même SYN-ACK. Cette fois il arrive : TCP a corrigé la perte tout seul.",
      },
    },
    {
      from: "client",
      to: "server",
      label: "ACK",
      detail: "ack = y + 1",
      tone: "secondary",
      note: "Le client confirme à son tour avec ack = y + 1. La connexion est ouverte des deux côtés : on peut échanger des données.",
      states: { server: "ESTABLISHED" },
    },
    {
      from: "client",
      to: "server",
      label: "DATA",
      detail: "« GET / », 5 octets",
      tone: "info",
      note: "Premières données : le client envoie sa requête. Chaque octet envoyé a un numéro de séquence.",
    },
    {
      from: "server",
      to: "client",
      label: "ACK",
      detail: "ack = x + 6",
      tone: "secondary",
      note: "Le serveur confirme avoir bien reçu les 5 octets en indiquant le prochain qu'il attend. C'est ainsi que TCP sait ce qui est arrivé, et ce qu'il faut renvoyer.",
    },
  ],
};
