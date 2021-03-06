/* */ 
var assert = require('assert');
var types = require('./types');
var getFieldValue = types.getFieldValue;
var n = types.namedTypes;
var sourceMap = require('source-map');
var SourceMapConsumer = sourceMap.SourceMapConsumer;
var SourceMapGenerator = sourceMap.SourceMapGenerator;
var hasOwn = Object.prototype.hasOwnProperty;
function getUnionOfKeys() {
  var result = {};
  var argc = arguments.length;
  for (var i = 0; i < argc; ++i) {
    var keys = Object.keys(arguments[i]);
    var keyCount = keys.length;
    for (var j = 0; j < keyCount; ++j) {
      result[keys[j]] = true;
    }
  }
  return result;
}
exports.getUnionOfKeys = getUnionOfKeys;
function comparePos(pos1, pos2) {
  return (pos1.line - pos2.line) || (pos1.column - pos2.column);
}
exports.comparePos = comparePos;
function copyPos(pos) {
  return {
    line: pos.line,
    column: pos.column
  };
}
exports.copyPos = copyPos;
exports.composeSourceMaps = function(formerMap, latterMap) {
  if (formerMap) {
    if (!latterMap) {
      return formerMap;
    }
  } else {
    return latterMap || null;
  }
  var smcFormer = new SourceMapConsumer(formerMap);
  var smcLatter = new SourceMapConsumer(latterMap);
  var smg = new SourceMapGenerator({
    file: latterMap.file,
    sourceRoot: latterMap.sourceRoot
  });
  var sourcesToContents = {};
  smcLatter.eachMapping(function(mapping) {
    var origPos = smcFormer.originalPositionFor({
      line: mapping.originalLine,
      column: mapping.originalColumn
    });
    var sourceName = origPos.source;
    if (sourceName === null) {
      return;
    }
    smg.addMapping({
      source: sourceName,
      original: copyPos(origPos),
      generated: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      },
      name: mapping.name
    });
    var sourceContent = smcFormer.sourceContentFor(sourceName);
    if (sourceContent && !hasOwn.call(sourcesToContents, sourceName)) {
      sourcesToContents[sourceName] = sourceContent;
      smg.setSourceContent(sourceName, sourceContent);
    }
  });
  return smg.toJSON();
};
exports.getTrueLoc = function(node, lines) {
  if (!node.loc) {
    return null;
  }
  var start = node.loc.start;
  var end = node.loc.end;
  if (node.comments) {
    node.comments.forEach(function(comment) {
      if (comment.loc) {
        if (comparePos(comment.loc.start, start) < 0) {
          start = comment.loc.start;
        }
        if (comparePos(end, comment.loc.end) < 0) {
          end = comment.loc.end;
        }
      }
    });
  }
  if (comparePos(start, end) < 0) {
    start = copyPos(start);
    lines.skipSpaces(start, false, true);
    if (comparePos(start, end) < 0) {
      end = copyPos(end);
      lines.skipSpaces(end, true, true);
    }
  }
  return {
    start: start,
    end: end
  };
};
exports.fixFaultyLocations = function(node, lines) {
  var loc = node.loc;
  if (loc) {
    if (loc.start.line < 1) {
      loc.start.line = 1;
    }
    if (loc.end.line < 1) {
      loc.end.line = 1;
    }
  }
  if (node.type === "TemplateLiteral") {
    fixTemplateLiteral(node, lines);
  } else if ((n.MethodDefinition && n.MethodDefinition.check(node)) || (n.Property.check(node) && (node.method || node.shorthand))) {
    node.value.loc = null;
    if (n.FunctionExpression.check(node.value)) {
      node.value.id = null;
    }
  }
};
function fixTemplateLiteral(node, lines) {
  assert.strictEqual(node.type, "TemplateLiteral");
  if (node.quasis.length === 0) {
    return;
  }
  var afterLeftBackTickPos = copyPos(node.loc.start);
  assert.strictEqual(lines.charAt(afterLeftBackTickPos), "`");
  assert.ok(lines.nextPos(afterLeftBackTickPos));
  var firstQuasi = node.quasis[0];
  if (comparePos(firstQuasi.loc.start, afterLeftBackTickPos) < 0) {
    firstQuasi.loc.start = afterLeftBackTickPos;
  }
  var rightBackTickPos = copyPos(node.loc.end);
  assert.ok(lines.prevPos(rightBackTickPos));
  assert.strictEqual(lines.charAt(rightBackTickPos), "`");
  var lastQuasi = node.quasis[node.quasis.length - 1];
  if (comparePos(rightBackTickPos, lastQuasi.loc.end) < 0) {
    lastQuasi.loc.end = rightBackTickPos;
  }
  node.expressions.forEach(function(expr, i) {
    var dollarCurlyPos = lines.skipSpaces(expr.loc.start, true, false);
    if (lines.prevPos(dollarCurlyPos) && lines.charAt(dollarCurlyPos) === "{" && lines.prevPos(dollarCurlyPos) && lines.charAt(dollarCurlyPos) === "$") {
      var quasiBefore = node.quasis[i];
      if (comparePos(dollarCurlyPos, quasiBefore.loc.end) < 0) {
        quasiBefore.loc.end = dollarCurlyPos;
      }
    }
    var rightCurlyPos = lines.skipSpaces(expr.loc.end, false, false);
    if (lines.charAt(rightCurlyPos) === "}") {
      assert.ok(lines.nextPos(rightCurlyPos));
      var quasiAfter = node.quasis[i + 1];
      if (comparePos(quasiAfter.loc.start, rightCurlyPos) < 0) {
        quasiAfter.loc.start = rightCurlyPos;
      }
    }
  });
}
