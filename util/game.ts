import type { Song } from "@/util/types";

export class Game {
  private songs: Song[];
  private totalRounds: number;
  private currentRound: number;
  private score: number;
  private usedSongs: Set<string>;
  private userInputs: {
    [round: number]: { userChoice: Song; correctSong: Song };
  };

  constructor(songs: Song[], totalRounds: number) {
    this.songs = songs;
    this.totalRounds = totalRounds;
    this.currentRound = 0;
    this.score = 0;
    this.usedSongs = new Set();
    this.userInputs = {};
  }

  startNewRound() {
    if (this.currentRound > this.totalRounds) {
      return null;
    }
    const currentSong = this.getUnusedRandomSong();
    const wrongAnswers = this.getWrongAnswers(currentSong);
    const allOptions = this.shuffleArray([currentSong, ...wrongAnswers]);

    return {
      currentSong,
      options: allOptions,
      roundNumber: this.currentRound,
    };
  }

  getUnusedRandomSong() {
    let song;
    do {
      song = this.songs[Math.floor(Math.random() * this.songs.length)];
    } while (this.usedSongs.has(song.name));

    this.usedSongs.add(song.name);
    return song;
  }

  getWrongAnswers(correctSong: Song) {
    let wrongAnswers: Song[] = [];
    while (wrongAnswers.length < 3) {
      let randomSong = this.getUnusedRandomSong();
      if (
        randomSong.name !== correctSong.name &&
        !wrongAnswers.some((s) => s.name === randomSong.name)
      ) {
        wrongAnswers.push(randomSong);
      }
    }
    return wrongAnswers;
  }

  shuffleArray(array: Song[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  checkAnswer(userChoice: Song, correctSong: Song) {
    const isCorrect = userChoice.id === correctSong.id;
    if (isCorrect) {
      this.score++;
    }

    this.userInputs[this.currentRound] = { userChoice, correctSong };
    this.currentRound++;
  }

  getScore() {
    return this.score;
  }

  getTotalRounds() {
    return this.totalRounds;
  }

  isGameOver() {
    return this.currentRound >= this.totalRounds;
  }

  getUserInputs() {
    return this.userInputs;
  }
}
