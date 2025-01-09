# galactic-sovereign-frontend

This project holds the website for the [Galactic Sovereign](https://galactic-sovereign.gasteropo.de) browser game. It is backed by the [galactic-sovereign](https://github.com/Knoblauchpilze/galactic-sovereign) service.

The project is working and deployed already but provide minimal features. You can play the game and there's a persistent server allowing people to run their account as they wish. Some screenshots are available below:

![Website overview](resources/website-overview.png)

![Game home page](resources/game-overview.png)

# Badges


# Installation

## Prerequisites

This project requires the following tools to be installed on your machine:
* [node](https://nodejs.org/en/download)
* [docker](https://docs.docker.com/engine/install/ubuntu/) (for Ubuntu, but can be adapted for other OS)

## Setup the repository

Once this is done, you can clone the repository locally:

```bash
git clone git@github.com:Knoblauchpilze/galactic-sovereign-frontend.git
```

After this you can install the dependencies and start the preview of the website:
```bash
cd /path/to/the/repo
make instal
make dev
```

This should open a new tab in your browser with the website.

## Additional information

This project was generated from the [template-frontend](https://github.com/Knoblauchpilze/template-frontend) project. It also uses the [frontend-toolkit](https://github.com/Knoblauchpilze/frontend-toolkit) to interact with the backend service.

# What is the goal of this project?

## Context

This project was initially integrated in the [galactic-sovereign](https://github.com/Knoblauchpilze/galactic-sovereign) project as it's working hand in hand with the main service. But the monorepo architecture was quite cumbersome to maintain.

To improve the situation this project (along some other services) was extracted to a dedicated repository.

## Future development

This is not the first time that we attempt to build a clone of [Ogame](https://lobby.ogame.gameforge.com/en_GB/). The first attempt is split into the following two repositories:
* server over at [sogserver](https://github.com/Knoblauchpilze/sogserver)
* client over at [sogclient](https://github.com/Knoblauchpilze/sogclient)

This website is 